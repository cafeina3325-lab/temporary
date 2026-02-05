"use client";

import { useScroll } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

type AnimationPhase =
    | "idle"
    | "entering"
    | "developed"
    | "exiting"
    | "backward-entering"
    | "backward-developed"
    | "backward-exiting";

interface SectionDAnimationValues {
    titleOpacity: number;
    titleClipPath: string;
    titleUnderlineWidth: number;
    getRowOpacity: (rowIndex: number) => number;
    getRowDelay: (rowIndex: number) => number;
    gridSpacing: string;
    gridAlignment: string;
    currentColumns: number;
    phase: AnimationPhase;
}

export function useSectionDAnimation(
    sectionRef: RefObject<HTMLElement | null>,
    totalItems: number = 12,
    columnsConfig: { mobile: number; tablet: number; desktop: number } = {
        mobile: 2,
        tablet: 3,
        desktop: 4,
    }
): SectionDAnimationValues {
    const [phase, setPhase] = useState<AnimationPhase>("idle");
    const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [totalRows, setTotalRows] = useState(3);
    const [currentColumns, setCurrentColumns] = useState(4);

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Calculate viewport intersection
    const [viewportIntersection, setViewportIntersection] = useState({
        topPercent: 0,
        bottomPercent: 0,
    });

    // Calculate total rows based on viewport width
    useEffect(() => {
        const calculateRows = () => {
            if (typeof window === 'undefined') return;

            const width = window.innerWidth;
            let columns = columnsConfig.desktop;

            if (width < 640) {
                columns = columnsConfig.mobile;
            } else if (width < 1024) {
                columns = columnsConfig.tablet;
            }

            setCurrentColumns(columns);
            const rows = Math.ceil(totalItems / columns);
            setTotalRows(rows);
        };

        calculateRows();
        window.addEventListener("resize", calculateRows);
        return () => window.removeEventListener("resize", calculateRows);
    }, [totalItems, columnsConfig]);

    useEffect(() => {
        const updateScrollMetrics = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const topPercent = ((viewportHeight - rect.top) / viewportHeight) * 100;
            const bottomPercent =
                ((viewportHeight - rect.bottom) / viewportHeight) * 100;

            setViewportIntersection({ topPercent, bottomPercent });

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
        updateScrollMetrics();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [sectionRef, lastScrollY]);

    // State machine
    useEffect(() => {
        const { topPercent, bottomPercent } = viewportIntersection;

        // Reset when section exits above viewport
        if (topPercent < 0) {
            setPhase("idle");
            return;
        }

        // Forward scroll logic
        if (scrollDirection === "down") {
            if (phase === "idle" && topPercent >= 75) {
                setPhase("entering");
            } else if (phase === "entering" && topPercent >= 85) {
                setPhase("developed");
            } else if (phase === "developed" && bottomPercent >= 50) {
                setPhase("exiting");
            }
        }

        // Backward scroll logic
        if (scrollDirection === "up") {
            if ((phase === "exiting" || phase === "developed") && bottomPercent < 50) {
                setPhase("backward-entering");
            } else if (phase === "backward-entering" && topPercent < 85) {
                setPhase("backward-developed");
            } else if (phase === "backward-developed" && topPercent < 30) {
                setPhase("backward-exiting");
            }
        }
    }, [viewportIntersection, scrollDirection, phase]);

    // Animation values
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
                return 1;
            case "backward-exiting":
                return 0;
            default:
                return 1;
        }
    };

    const getTitleClipPath = (): string => {
        switch (phase) {
            case "idle":
                return "inset(0 0 0 0)"; // Visible by default
            case "entering":
                return "inset(0 0 0 0)"; // Revealing (mask animates top to bottom)
            case "developed":
            case "backward-entering":
            case "backward-developed":
                return "inset(0 0 0 0)"; // Fully visible
            case "exiting":
            case "backward-exiting":
                return "inset(0 0 0 0)";
            default:
                return "inset(0 0 0 0)";
        }
    };

    const getTitleUnderlineWidth = (): number => {
        switch (phase) {
            case "backward-entering":
            case "backward-developed":
                return 100; // Full width underline
            case "backward-exiting":
                return 0;
            default:
                return 0;
        }
    };

    const getRowOpacity = (rowIndex: number): number => {
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
                return 1;
            case "backward-exiting":
                return 0;
            default:
                return 1;
        }
    };

    const getRowDelay = (rowIndex: number): number => {
        if (phase === "entering" || phase === "developed") {
            return rowIndex * 0.15; // 150ms stagger per row
        }
        return 0;
    };

    const getGridSpacing = (): string => {
        switch (phase) {
            case "backward-entering":
            case "backward-developed":
                return "gap-3"; // Compact spacing (0.75rem)
            default:
                return "gap-6"; // Normal spacing (1.5rem)
        }
    };

    const getGridAlignment = (): string => {
        switch (phase) {
            case "backward-entering":
            case "backward-developed":
                return "justify-items-center"; // Center alignment
            default:
                return "justify-items-start"; // Normal alignment
        }
    };

    return {
        titleOpacity: getTitleOpacity(),
        titleClipPath: getTitleClipPath(),
        titleUnderlineWidth: getTitleUnderlineWidth(),
        getRowOpacity,
        getRowDelay,
        gridSpacing: getGridSpacing(),
        gridAlignment: getGridAlignment(),
        currentColumns,
        phase,
    };
}
