export default function About() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-3 text-center">
                <div>
                    <h1 className="text-3xl font font-semibold text-center my-7">
                        About Turhan&apos;s Blog
                    </h1>
                    <div className="text-md text-gray-500 flex flex-col gap-6">
                        <p>
                            Welcome to Turhan&apos;s Blog! Created by Turhan,
                            this blog serves as a personal platform to share his
                            insights and ideas with the world. Turhan is an
                            enthusiastic developer who enjoys writing about
                            technology, coding, and a variety of related topics.
                        </p>

                        <p>
                            On this blog, you&apos;ll discover weekly articles
                            and tutorials covering a range of topics including
                            web development, software engineering, and
                            programming languages. Sahand is continually
                            learning and exploring new technologies, so make
                            sure to visit frequently for the latest updates!
                        </p>

                        <p>
                            This website is created using Next.js and{" "}
                            <a
                                href="https://authjs.dev/"
                                target="_blank"
                                className="text-teal-500 hover:underline"
                            >
                                Auth.js
                            </a>
                            .
                        </p>

                        <p>
                            We invite you to comment on our posts and interact
                            with other readers. You can like and reply to
                            others&apos; comments as well. We believe that a
                            community of learners can support each other&apos;s
                            growth and development.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
