"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MOCK_PORTFOLIO } from "@/app/constants";

const GAP = 16; // Default gap
const OVERSCAN = 300; // Buffer pixels

// Helper to pick random item avoiding immediate repeat
const getRandomItem = (excludeId?: string) => {
    let candidates = MOCK_PORTFOLIO;
    if (excludeId && candidates.length > 1) {
        candidates = candidates.filter((i) => i.id !== excludeId);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
};

type CardSlot = {
    key: string;
    item: (typeof MOCK_PORTFOLIO)[0];
    x: number;
};

const StreamRow = ({
    speed = 0.04,
}: {
    speed?: number;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const previousTimeRef = useRef<number | undefined>(undefined);
    const [slots, setSlots] = useState<CardSlot[]>([]);
    const slotsRef = useRef<CardSlot[]>([]);
    const isInitialized = useRef(false);
    const lastAddedIdRef = useRef<string | undefined>(undefined);

    // Initialize slots
    useEffect(() => {
        if (!containerRef.current) return;

        // Estimate needed slots
        const screenWidth = window.innerWidth;
        const currentGap = screenWidth < 640 ? 8 : 16; // Match animate logic
        // Conservative width estimate (120px) to ensure we fill the screen
        const needed = Math.ceil((screenWidth + OVERSCAN * 2) / (120 + currentGap)) + 2;

        const initialSlots: CardSlot[] = [];
        let currentX = -OVERSCAN;
        let lastId: string | undefined;

        for (let i = 0; i < needed; i++) {
            const item = getRandomItem(lastId);
            lastId = item.id;

            // Calculate approximate width for placement logic
            const cardW = Math.max(120, Math.min(220, window.innerWidth * 0.12));

            initialSlots.push({
                key: `slot-init-${i}-${Date.now()}`,
                item,
                x: currentX,
            });
            currentX += cardW + currentGap;
        }

        lastAddedIdRef.current = lastId;
        slotsRef.current = initialSlots;
        setSlots(initialSlots);
        isInitialized.current = true;
    }, []);

    // Animation Loop
    const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            // Clamp dt to max 33ms (~30fps) to avoid huge jumps
            const dt = Math.min(deltaTime, 33);

            const container = containerRef.current;
            if (!container) return;

            const vw = window.innerWidth;
            const cardW = Math.max(120, Math.min(220, vw * 0.12));
            const currentGap = vw < 640 ? 8 : 16; // Match sm:gap-4 vs gap-2 logic roughly

            let needsStateUpdate = false;

            const newSlots = slotsRef.current.map(slot => {
                let newX = slot.x - (speed * dt); // Move Left

                // Recycle check: if fully exited left (with buffer)
                if (newX < -cardW - 100) {
                    // Find right-most position
                    const currentRightMostX = slotsRef.current.reduce((max, s) => Math.max(max, s.x), -Infinity);
                    // The rightmost item also moved this frame
                    const predictedRightMostX = currentRightMostX - (speed * dt);

                    newX = predictedRightMostX + cardW + currentGap;

                    // Pick new content ensuring no immediate repeat
                    const newItem = getRandomItem(lastAddedIdRef.current);
                    lastAddedIdRef.current = newItem.id;

                    needsStateUpdate = true;

                    return {
                        ...slot,
                        x: newX,
                        item: newItem
                    };
                }

                return { ...slot, x: newX };
            });

            slotsRef.current = newSlots;

            // Direct DOM update for performance
            if (container.children.length === newSlots.length) {
                newSlots.forEach((slot, i) => {
                    const node = container.children[i] as HTMLElement;
                    if (node) {
                        // Integer pixel rounding
                        const rx = Math.round(slot.x);
                        node.style.transform = `translate3d(${rx}px, 0, 0)`;
                    }
                });
            }

            if (needsStateUpdate) {
                setSlots(newSlots);
            }
        }

        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isInitialized.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [slots]);

    return (
        <div
            ref={containerRef}
            className="absolute left-0 w-full h-[clamp(160px,18vw,260px)] whitespace-nowrap will-change-transform pointer-events-none"
            style={{ top: 0 }}
        >
            {slots.map((slot) => (
                <div
                    key={slot.key}
                    className="absolute top-0 left-0 bg-white/5 border border-white/5 rounded-md overflow-hidden"
                    style={{
                        // Initial render position
                        transform: `translate3d(${Math.round(slot.x)}px, 0, 0)`,
                        width: 'clamp(120px, 12vw, 220px)',
                        height: '100%',
                    }}
                >
                    <Image
                        src={slot.item.image}
                        alt={slot.item.artist}
                        fill
                        className="object-cover grayscale"
                        sizes="220px"
                    />
                </div>
            ))}
        </div>
    );
};

export default function RandomStreamMarquee() {
    return (
        <div className="w-full h-full flex flex-col gap-2 sm:gap-4 overflow-hidden py-4 pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="relative w-full flex-shrink-0" style={{ height: 'clamp(160px, 18vw, 260px)' }}>
                    {/* Randomize speed slightly for organic feel */}
                    <StreamRow speed={0.03 + (Math.random() * 0.03)} />
                </div>
            ))}
        </div>
    );
}
