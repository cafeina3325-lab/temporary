"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

type AnimationPhase =
    | "idle"
    | "entering"
    | "developed"
    | "exiting"
    | "backward-entering"
    | "backward-developed"
    | "backward-exiting";

interface SectionCAnimationValues {
    titleOpacity: number;
    cardsOpacity: number;
    cardsScale: number;
    ctaOpacity: number;
    getCardDelay: (index: number) => number;
    phase: AnimationPhase;
}

export function useSectionCAnimation(
    sectionRef: RefObject<HTMLElement | null>
): SectionCAnimationValues {
    const [phase, setPhase] = useState<AnimationPhase>("idle");
    const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
    const [lastScrollY, setLastScrollY] = useState(0);

    // Track scroll progress of the section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Calculate viewport intersection percentages
    const [viewportIntersection, setViewportIntersection] = useState({
        topPercent: 0,
        bottomPercent: 0,
    });

    useEffect(() => {
        const updateScrollMetrics = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate where section top is relative to viewport (0 = top, 100 = bottom)
            const topPercent = ((viewportHeight - rect.top) / viewportHeight) * 100;
            // Calculate where section bottom is relative to viewport
            const bottomPercent =
                ((viewportHeight - rect.bottom) / viewportHeight) * 100;

            setViewportIntersection({ topPercent, bottomPercent });

            // Detect scroll direction
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection("up");
            }
            setLastScrollY(currentScrollY);
        };

        const handleScroll = () => {
            requestAnimationFrame(updateScrollMetrics);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        updateScrollMetrics(); // Initial calculation

        return () => window.removeEventListener("scroll", handleScroll);
    }, [sectionRef, lastScrollY]);

    // State machine for animation phases
    useEffect(() => {
        const { topPercent, bottomPercent } = viewportIntersection;

        // Reset when section exits above viewport
        if (topPercent < 0) {
            setPhase("idle");
            return;
        }

        // Forward scroll logic
        if (scrollDirection === "down") {
            if (phase === "idle" && topPercent >= 70) {
                setPhase("entering");
            } else if (phase === "entering" && topPercent >= 80) {
                setPhase("developed");
            } else if (phase === "developed" && bottomPercent >= 40) {
                setPhase("exiting");
            }
        }

        // Backward scroll logic
        if (scrollDirection === "up") {
            // When scrolling back up and section is visible
            if (
                (phase === "exiting" || phase === "developed") &&
                bottomPercent < 40
            ) {
                setPhase("backward-entering");
            } else if (phase === "backward-entering" && topPercent < 80) {
                setPhase("backward-developed");
            } else if (phase === "backward-developed" && topPercent < 30) {
                setPhase("backward-exiting");
            }
        }
    }, [viewportIntersection, scrollDirection, phase]);

    // Direct animation values based on phase (simpler and more reliable)
    const getTitleOpacity = (): number => {
        switch (phase) {
            case "idle":
                return 1; // Show by default
            case "entering":
            case "developed":
                return 1;
            case "exiting":
                return 0.3;
            case "backward-entering":
            case "backward-developed":
                return 0.6;
            case "backward-exiting":
                return 0;
            default:
                return 1;
        }
    };

    const getCardsOpacity = (): number => {
        switch (phase) {
            case "idle":
                return 1; // Show by default
            case "entering":
            case "developed":
                return 1;
            case "exiting":
                return 0.3;
            case "backward-entering":
            case "backward-developed":
                return 0.6;
            case "backward-exiting":
                return 0;
            default:
                return 1;
        }
    };

    const getCardsScale = (): number => {
        switch (phase) {
            case "backward-entering":
            case "backward-developed":
                return 0.85;
            case "backward-exiting":
                return 0.7;
            default:
                return 1;
        }
    };

    const getCtaOpacity = (): number => {
        switch (phase) {
            case "idle":
                return 1; // Show by default
            case "entering":
                return 0;
            case "developed":
                return 1;
            case "exiting":
                return 0.3;
            case "backward-entering":
            case "backward-developed":
            case "backward-exiting":
                return 0;
            default:
                return 1;
        }
    };

    // Staggered delay for cards (left to right)
    const getCardDelay = (index: number): number => {
        if (phase === "entering" || phase === "developed") {
            return index * 0.12; // 120ms stagger
        }
        return 0;
    };

    return {
        titleOpacity: getTitleOpacity(),
        cardsOpacity: getCardsOpacity(),
        cardsScale: getCardsScale(),
        ctaOpacity: getCtaOpacity(),
        getCardDelay,
        phase,
    };
}
