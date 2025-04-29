
"use client";

// import Image from "next/image";
import { motion } from "framer-motion";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {useEffect, useRef, useState} from "react";

// import Link from "next/link";

const AnimatedText = () => {
    const [text, setText] = useState('Cyrus');

    const currentIndexRef = useRef(0);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const texts = ['Cyrus', 'YSR'];
        const intervalId = setInterval(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                currentIndexRef.current = (currentIndexRef.current+ 1) % texts.length;
                setText(texts[currentIndexRef.current]);
                setIsFadingOut(false);
            }, 800);
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <span className="text-orange-400 text-8xl text-center max-w-full mt-2 dark:text-orange-400">
            {text.split('').map((char, index) => {
                const totalChars = text.length;
                const angle = (index / totalChars) * 2 * Math.PI;
                const distance = 300;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={isFadingOut
                            ? { opacity: 0, x, y }
                            : { opacity: 1, x: 0, y: 0 }
                        }
                        transition={{
                            delay: isFadingOut ? 0 : index * 0.1,
                            duration: 0.8,
                            type: 'tween',
                            ease: 'easeInOut'
                        }}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </span>
    );
};
const IdentityListCardItem = () => {
    const identities = ['Gopher', 'ACMer', 'Backend Developer', 'Game Lover','Movie Critic','Geek'];
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="flex justify-end">
            <div className="flex flex-col items-end space-y-2">
                {identities.map((identity, index) => (
                    <motion.p
                        key={index}
                        initial={{ scale: 1 }}
                        animate={{
                            scale: hoveredIndex === index ? 1.2 : 1,
                        }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`cursor-pointer text-2xl ${hoveredIndex === index ? 'text-orange-400' : 'text-gray-800'} ${hoveredIndex!== null && hoveredIndex!== index? 'text-gray-300' : ''}`}
                    >
                        {identity}
                    </motion.p>
                ))}
            </div>
        </div>
    );
};
export function ThreeDCardDemo() {
    return (
        <CardContainer className="inter-var relative">

            <CardBody

                className="bg-gradient-to-r from-white to-gray-200 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem
                    translateZ="90"
                    className="text-xl font-bold text-neutral-600 dark:text-white">
                    My name is:
                </CardItem>
                <div className="flex justify-center">
                    <CardItem as="p" translateZ="90">
                        <AnimatedText />
                    </CardItem>
                    {/* 你可以在这里添加其他的 CardItem */}
                </div>
                <CardItem
                        as="div"
                        translateZ="90"
                        className="w-full border-t-2 border-black my-4 dark:border-gray-600">
                </CardItem>
                <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white">
                    I&apos; m a:
                </CardItem>
                <CardItem as="div" className="w-full">
                    <IdentityListCardItem />
                </CardItem>

            </CardBody>
        </CardContainer>
    );
}