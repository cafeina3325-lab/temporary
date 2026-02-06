"use client";

import { useEffect, useRef } from "react";

interface Star {
    baseX: number; // Store original position
    baseY: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    depth: number; // 0.1 (far) to 1.0 (near)
    minOpacity: number;
    maxOpacity: number;
}

interface TwinklingStarsProps {
    isActive: boolean;
}

export default function TwinklingStars({ isActive }: TwinklingStarsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const animationFrameId = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Initialize stars
        const initStars = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Reduced density further: / 24000 (Half of 12000)
            const starCount = Math.floor((width * height) / 12000);
            const stars: Star[] = [];

            for (let i = 0; i < starCount; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const r = Math.random();
                let size, depth;

                if (r < 0.4) {
                    // 40% - 1px (Far)
                    size = 1;
                    depth = 0.1;
                } else if (r < 0.7) {
                    // 30% - 2px
                    size = 2;
                    depth = 0.4;
                } else if (r < 0.9) {
                    // 20% - 3px
                    size = 3;
                    depth = 0.7;
                } else {
                    // 10% - 4px (Near)
                    size = 4;
                    depth = 1.0;
                }

                const normalizedDepth = (depth - 0.1) / 0.9;
                const minOpacity = normalizedDepth * 0.6;
                const maxOpacity = minOpacity + 0.3;

                stars.push({
                    baseX: x,
                    baseY: y,
                    x: x,
                    y: y,
                    size: size,
                    opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
                    speed: Math.random() * 0.005 + 0.001,
                    depth: depth,
                    minOpacity: minOpacity,
                    maxOpacity: maxOpacity,
                });
            }
            starsRef.current = stars;
        };

        const handleResize = () => {
            initStars();
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate offset from center, normalized
            mouseRef.current = {
                x: (e.clientX - window.innerWidth / 2) * 0.05, // reduced sensitivity
                y: (e.clientY - window.innerHeight / 2) * 0.05,
            };
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY * 0.2; // scroll sensitivity
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);
        initStars();

        const render = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseOffsetX = mouseRef.current.x;
            const mouseOffsetY = mouseRef.current.y;
            const scrollOffset = scrollRef.current;

            starsRef.current.forEach((star, index) => {
                // Twinkle logic
                // Twinkle logic
                star.opacity += star.speed;
                if (star.opacity > star.maxOpacity || star.opacity < star.minOpacity) {
                    star.speed = -star.speed;
                    // Clamp opacity
                    if (star.opacity > star.maxOpacity) star.opacity = star.maxOpacity;
                    if (star.opacity < star.minOpacity) star.opacity = star.minOpacity;
                }

                // Parallax Logic
                // Move opposite to mouse and scroll, scaled by depth
                // Near stars (depth 1) move most. Far stars (depth 0.1) move least.
                let newX = star.baseX - mouseOffsetX * star.depth * 2;
                let newY = star.baseY - (mouseOffsetY + scrollOffset) * star.depth;

                // Infinite wrap (optional, but good for scroll)
                // If star goes off screen top, move to bottom
                if (newY < -50) newY += canvas.height + 100;
                if (newY > canvas.height + 50) newY -= canvas.height + 100;

                // Wrap Horizontal
                if (newX < -50) newX += canvas.width + 100;
                if (newX > canvas.width + 50) newX -= canvas.width + 100;

                // Minimum 0 opacity check for valid drawing
                const visibleOpacity = Math.max(0, Math.min(1, star.opacity));

                ctx.beginPath();
                ctx.arc(newX, newY, star.size, 0, Math.PI * 2);

                // Mix Gold and White stars
                if (index % 5 < 2) {
                    ctx.fillStyle = `rgba(214, 190, 138, ${visibleOpacity})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = "rgba(214, 190, 138, 0.8)";
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${visibleOpacity})`;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
                }

                ctx.fill();
            });

            animationFrameId.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
                }`}
        />
    );
}
