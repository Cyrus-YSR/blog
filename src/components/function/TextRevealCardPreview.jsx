"use client";
import React from "react";
import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "../ui/text-reveal-card";

export default function TextRevealCardPreview() {
    return (
        <div className="flex items-center justify-center bg-neutral-100 h-[40rem] rounded-2xl w-full">
            <TextRevealCard
                text="Hover me, guys"
                revealText="Luck is with you"
            >
                <TextRevealCardTitle>
                    Life is always full of bitterness, but sometimes, you just need to taste it.
                </TextRevealCardTitle>
                <TextRevealCardDescription>
                    Just do it!
                </TextRevealCardDescription>
            </TextRevealCard>
        </div>
    );
}