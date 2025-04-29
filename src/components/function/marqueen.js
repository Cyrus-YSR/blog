import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
const reviews = [
    {
        name: "Golang",
        username: "@Robert Griesemer",
        body: "It performs incredibly remarkably under high concurrency conditions. It's amazing. I love it.",
        img: "/go.jpeg",
        index:1,
    },
    {
        name: "MySQL",
        username: "@Monty",
        body: "It supports a distributed database architecture and can handle large-scale data through sharding and partitioning. ",
        img: "/Mysql.jpeg",
        index:2,
    },
    {
        name: "Redis",
        username: "@alvatore Sanfilippo",
        body: "Its performance is astonishing. I used it to implement a distributed transaction lock.",
        img: "/redis.jpg",
        index:3,

    },
    {
        name: "RocketMQ",
        username: "@jane",
        body: "It is widely applied in scenarios with high concurrency and high throughput, such as e-commerce, finance, and real-time data analysis. ",
        img: "/rocketmq.jpeg",
        index:4,
    },
    {
        name: "Docker",
        username: "@Solomon Hykes",
        body: "It can achieve the isolation of applications and lightweight deployment through containerization technology. ",
        img: "/docker.jpeg",
        index:5,
    },
    {
        name: "Kubernetes",
        username: "@Joe Beda",
        body: "It is an open-source container orchestration platform that can automate deployment, perform elastic scaling, self-heal, enable service discovery, and achieve load balancing. ",
        img: "/k8s.png",
        index:6,
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
/**
 * @param {{
 *   img: string;
 *   name: string;
 *   username: string;
 *   body: string;
 * }} props
 */
const colors = ["bg-[#ADD8E6]", "bg-[#2F4F4F]", "bg-[#800000]","bg-[#D2B48C]","bg-[#C0C0C0]","bg-[#000080]"];
const ReviewCard = ({
                        img,
                        name,
                        username,
                        body,
                        index
                    }) => {
    const colorClass = colors[index-1];
    return (
        <figure
            className={cn(
                "relative h-48 w-100 cursor-pointer overflow-hidden rounded-xl  p-4",
                colorClass, // 应用动态背景色
                "text-white", // 统一文字颜色
                "hover:bg-opacity-90", // 悬停效果
                "dark:bg-opacity-80 dark:hover:bg-opacity-75" // 深色模式适配
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <Image className="rounded-full" width="90" height="100" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export function MarqueeDemo() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden
        bg-gradient-to-b from-white to-neutral-100
      dark:from-neutral-950 dark:to-neutral-800
      rounded-xl
       max-w-0.01xl mx-auto">
            <Marquee pauseOnHover className="[--duration:40s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:40s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-neutral-950"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-neutral-950"></div>
        </div>

    );
}
