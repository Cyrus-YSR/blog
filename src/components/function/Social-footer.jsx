import Link from "next/link"
import { Github, Facebook, Youtube } from "lucide-react"

export function SocialFooter({
                                 githubUrl = "https://github.com/yourusername",
                                 facebookUrl = "https://facebook.com/yourprofile",
                                 instagramUrl = "https://instagram.com/yourhandle",
                                 className = "",
                             }) {
    return (
        <footer className={`w-full py-6 px-4 border-t ${className}`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="flex items-center justify-center space-x-6 mt-4">
                    <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                        aria-label="GitHub"
                    >
                        <Github size={24} />
                    </Link>
                    <Link
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook size={24} />
                    </Link>
                    <Link
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Youtube"
                    >
                        <Youtube size={24} />
                    </Link>
                </div>
                <p className="text-sm text-gray-500 mt-4">© {new Date().getFullYear()} CyrusYSR. All rights reserved.</p>
            </div>
        </footer>
    )
}
