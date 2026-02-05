"use client";

import { useScroll } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

type AnimationPhase =
    | "idle"
    | "pinned-forward"
    | "pinned-backward"
    | "unpinning";

interface SectionEAnimationValues {
    titlePinned: boolean;
    titleOpacity: number;
    currentStep: number;
    getStepOpacity: (stepIndex: number) => number;
    progressPercent: number;
    showProgressIndicator: boolean;
    phase: AnimationPhase;
}

export function useSectionEAnimation(
    sectionRef: RefObject<HTMLElement | null>,
    totalSteps: number = 4
): SectionEAnimationValues {
    const [phase, setPhase] = useState<AnimationPhase>("idle");
    const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Calculate viewport intersection
    const [viewportIntersection, setViewportIntersection] = useState({
        topPercent: 0,
        bottomPercent: 0,
        sectionProgress: 0,
    });

    useEffect(() => {
        const updateScrollMetrics = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const topPercent = ((viewportHeight - rect.top) / viewportHeight) * 100;
            const bottomPercent =
                ((viewportHeight - rect.bottom) / viewportHeight) * 100;

            // Calculate how far through the section we've scrolled (0-1)
            const sectionHeight = rect.height;
            const scrolledIntoView = Math.max(0, viewportHeight - rect.top);
            const sectionProgress = Math.min(
                1,
                Math.max(0, scrolledIntoView / sectionHeight)
            );

            setViewportIntersection({ topPercent, bottomPercent, sectionProgress });

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
        const { topPercent, bottomPercent, sectionProgress } = viewportIntersection;

        // Reset when section exits above viewport
        if (topPercent < 0) {
            setPhase("idle");
            setCurrentStep(1);
            return;
        }

        // Forward scroll logic
        if (scrollDirection === "down") {
            if (phase === "idle" && topPercent >= 50) {
                setPhase("pinned-forward");
            } else if (phase === "pinned-forward" && bottomPercent >= 80) {
                setPhase("unpinning");
            }
        }

        // Backward scroll logic
        if (scrollDirection === "up") {
            if (
                (phase === "unpinning" || phase === "pinned-forward") &&
                bottomPercent < 80
            ) {
                setPhase("pinned-backward");
            } else if (phase === "pinned-backward" && topPercent < 50) {
                setPhase("idle");
            }
        }

        // Calculate current step based on scroll progress
        if (phase === "pinned-forward" || phase === "pinned-backward") {
            // Divide section progress into equal steps
            const stepProgress = sectionProgress * totalSteps;
            const calculatedStep = Math.min(
                totalSteps,
                Math.max(1, Math.ceil(stepProgress))
            );
            setCurrentStep(calculatedStep);
        }
    }, [viewportIntersection, scrollDirection, phase, totalSteps]);

    // Animation values
    const getTitlePinned = (): boolean => {
        return phase === "pinned-forward" || phase === "pinned-backward";
    };

    const getTitleOpacity = (): number => {
        switch (phase) {
            case "idle":
                return 1; // Show by default
            case "pinned-forward":
            case "pinned-backward":
                return 1;
            case "unpinning":
                return 0.3;
            default:
                return 1;
        }
    };

    const getStepOpacity = (stepIndex: number): number => {
        // stepIndex is 1-based (1, 2, 3, 4)
        if (phase === "pinned-forward") {
            // Forward: current step is fully visible, others hidden
            return stepIndex === currentStep ? 1 : 0;
        } else if (phase === "pinned-backward") {
            // Backward: current step strengthens, previous weakens
            if (stepIndex === currentStep) {
                return 1; // Current step fully visible
            } else if (stepIndex === currentStep + 1) {
                return 0.4; // Next step (previous in forward) weakens
            } else {
                return 0;
            }
        }
        return stepIndex === 1 ? 1 : 0; // Default: show first step
    };

    const getProgressPercent = (): number => {
        if (phase === "pinned-forward") {
            // Progress fills as steps advance
            return ((currentStep - 1) / (totalSteps - 1)) * 100;
        } else if (phase === "pinned-backward") {
            // Progress empties as steps reverse
            return ((currentStep - 1) / (totalSteps - 1)) * 100;
        }
        return 0;
    };

    const getShowProgressIndicator = (): boolean => {
        return phase === "pinned-backward";
    };

    return {
        titlePinned: getTitlePinned(),
        titleOpacity: getTitleOpacity(),
        currentStep,
        getStepOpacity,
        progressPercent: getProgressPercent(),
        showProgressIndicator: getShowProgressIndicator(),
        phase,
    };
}
