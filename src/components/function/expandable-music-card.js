"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { Play, Pause } from "lucide-react"
import Image from "next/image";

export default function ExpandableCardDemo() {
    const [active, setActive] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const audioRef = useRef(null)
    const id = useId()
    const ref = useRef(null)
    const sectionRef = useRef(null)

    // 视口观察逻辑
    useEffect(() => {
        const currentSectionRef = sectionRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIsVisible(entry.isIntersecting)
            })
        }, { threshold: 0.1 })

        if (currentSectionRef) observer.observe(currentSectionRef)

        return () => {
            if (currentSectionRef) observer.unobserve(currentSectionRef)
        }
    }, [sectionRef])

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(false)
                if (audioRef.current) {
                    audioRef.current.pause()
                    setIsPlaying(false)
                }
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
            if (audioRef.current) {
                audioRef.current.pause()
                setIsPlaying(false)
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [active])

    useOutsideClick(ref, () => {
        setActive(null)
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    })

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: "easeOut" } }
    }

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                <Image
                                    width={200}
                                    height={200}
                                    src={active.src || "/placeholder.svg"}
                                    alt={active.title}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400 text-base"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <motion.button
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={togglePlay}
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white flex items-center gap-2"
                                    >
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        {isPlaying ? "暂停" : "播放"}
                                    </motion.button>
                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        {typeof active.content === "function" ? active.content() : active.content}
                                    </motion.div>
                                </div>
                            </div>
                            <audio ref={audioRef} src={active.audioSrc} />
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="w-full max-w-6xl mx-auto px-4 text-left"
            >
                <div className="text-left">
                    <h2 className="text-3xl font-bold tracking-tight">Albums</h2>
                    <p className="text-muted-foreground mt-2">Some of my favorite singles</p>
                </div>
            </motion.div>
            <motion.ul
                ref={sectionRef}
                variants={cardVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4"
            >
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={card.title}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col  bg-gradient-to-r from-white to-gray-300 border shadow-2xl  dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col w-full">
                            <motion.div layoutId={`image-${card.title}-${id}`}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={card.src || "/placeholder.svg"}
                                    alt={card.title}
                                    className="h-60 w-full rounded-lg object-cover object-center"
                                />
                            </motion.div>
                            <div className="flex justify-center items-center flex-col">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                                >
                                    {card.description}
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.ul>
        </>
    )
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    )
}

// 注意：这里使用的是占位图片，您需要替换为实际的周杰伦专辑封面图片
// 同样，audioSrc也需要替换为实际的音频文件路径
const cards = [
    {
        description: "2000年发行",
        title: "Jay",
        src: "/jay.png?height=300&width=300",
        audioSrc: "/jay.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    《Jay》是周杰伦的首张专辑，于2000年发行。这张专辑奠定了他在华语乐坛的地位，包含了《可爱女人》、《星晴》、《娘子》等经典歌曲。专辑融合了R&B、摇滚等多种音乐元素，展现了周杰伦独特的音乐才华和创新精神。
                </p>
            )
        },
    },
    {
        description: "2019年翻唱发行",
        title: "Bleeding love",
        src: "/bleeding.jpg?height=300&width=300",
        audioSrc: "/bleeding.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    原唱丽安娜・刘易斯的声音力量感十足，而 Ni/Co 则是典型的 “情歌嗓”。Ni/Co 在翻唱时，赋予了这首歌更浓郁的情感色彩，以柔和、细腻的方式诠释歌曲中的爱情，让听众能更深刻地感受到歌词中所表达的深情与眷恋。
                </p>
            )
        },
    },
    {
        description: "2002年发行",
        title: "黑色柳丁",
        src: "/melody.png?height=300&width=300",
        audioSrc: "/melody.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    这张专辑融合了多种音乐风格，以 R&B 为基础，同时融入了摇滚、嘻哈、电子等元素，展现出丰富的音乐层次和独特的风格。例如，专辑中的《找自己》带有浓厚的摇滚风格，强烈的鼓点和激昂的吉他演奏，搭配陶喆独特的唱腔，充满了力量感；而《普通朋友》则是典型的 R&B 风格，旋律优美，节奏富有韵律，陶喆在歌曲中运用了大量的转音和假音技巧，将 R&B 的魅力展现得淋漓尽致。
                </p>
            )
        },
    },
    {
        description: "2001年发行",
        title: "风筝",
        src: "/green-light.png?height=300&width=300",
        audioSrc: "/green-light.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    专辑以 “风筝” 命名，寓意着一种自由与束缚之间的微妙关系，也象征着人生中不断追寻梦想、却又被现实种种因素牵扯的状态。就像风筝在空中飞翔，看似自由，却始终被线牵引着，这一概念贯穿了整张专辑的主题和情感脉络。
                </p>
            )
        },
    },
    {
        description: "1999年发行",
        title: "就是 莫文蔚",
        src: "/huranzhijian.png?height=300&width=300",
        audioSrc: "/huranzhijian.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    歌词以第一人称，用简洁而直白的语言，细腻地描绘出灾难降临时人们的脆弱、无助，以及在天昏地暗中对情感的珍惜与怀念。如 “忽然之间，天昏地暗，世界可以忽然什么都没有” 生动展现出灾难的突然与恐怖；“我明白，太放不开你的爱，太熟悉你的关怀，分不开，想你算是安慰还是悲哀” 则深刻刻画了对爱人的眷恋与纠结。
                </p>
            )
        },
    },
    {
        description: "2005年发行",
        title: "U87",
        src: "/grape.png?height=300&width=300",
        audioSrc: "/grape.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    2005 年陈奕迅加盟新艺宝唱片公司，推出专辑《U87》，梁荣骏为陈奕迅监制了专辑中的六首歌曲，其中包括《葡萄成熟时》。以红酒比喻人生的《葡萄成熟时》是黄伟文 “中年男人玩物” 系列的第一章，是黄伟文词作中相当温和的一首，用种植葡萄来形容经营爱情，阐述了词人对人生、爱情的独特观点。
                </p>
            )
        },
    },
    {
        description: "2009年发行",
        title: "情歌",
        src: "/love-song.png?height=300&width=300",
        audioSrc: "/love-song.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    一颗红豆为何想单挑整个宇宙。
                </p>
            )
        },
    },
    {
        description: "2007年发行",
        title: "改变自己",
        src: "/change.png?height=300&width=300",
        audioSrc: "/change.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    歌曲旋律轻快流畅，节奏富有动感，采用了流行摇滚的风格，以强烈的鼓点和激昂的吉他演奏为特色，给人一种充满活力和激情的感觉。这种旋律风格与歌曲积极向上的主题相得益彰，能够迅速带动听众的情绪，让人不自觉地跟着节奏摇摆，产生内心的共鸣。
                </p>
            )
        },
    },
    {
        description: "2017年发行",
        title: "哪里都是你",
        src: "/where.png?height=300&width=300",
        audioSrc: "/where.mp3", // 替换为实际音频文件
        content: () => {
            return (
                <p>
                    一首流行抒情的 R&B 风格歌曲，中间部分运用了 auto - tune，呈现出电音般的特殊质感，歌曲音调较高，真假和声转换流畅，非常抓耳。
                </p>
            )
        },
    },
]