import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";
import MDXRenderer from "../components/MDXRenderer";
import { extractHeadings } from "../lib/extractHeadings";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import { NextSeo } from "next-seo";
import { Articles } from "@prisma/client";
import { GetStaticProps, GetStaticPaths } from "next";
import { setCookie } from "cookies-next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


interface ArticleProps {
    articleData: Articles;
    locale: string;
}

const Article = ({ articleData, locale }: ArticleProps) => {
    const [mdxContent, setMdxContent] = useState<MDXRemoteSerializeResult<
        Record<string, unknown>,
        Record<string, unknown>
    > | null>(null);
    const [headings, setHeadings] = useState<string[]>([]);

    const [showAssessMent, setShowAssessMent] = useState(false);

    useEffect(() => {
        async function loadMDX() {
            const mdxString = articleData.mdxString;
            const mdxSource = await serialize(mdxString);
            setMdxContent(mdxSource);

            // Extract h1 headings
            const extractedHeadings = await extractHeadings(mdxString);
            setHeadings(extractedHeadings);
        }
        loadMDX();
    }, []);

    useEffect(() => {
        setCookie('preferredLanguage', locale)
    }, [locale])

    return (
        <div className="w-full">
            {/*
       * SEO
       */}
            <NextSeo
                title={articleData.title}
                description={articleData.description}
                canonical={articleData.canonical}
                openGraph={{
                    url: articleData.canonical,
                    title: articleData.openGraphTitle || "",
                    description: articleData.openGraphDescription || "",
                    images: [
                        {
                            url: articleData.openGraphImage || "",
                            width: 800,
                            height: 600,
                            alt: "Og Image Alt",
                            type: "image/jpeg",
                        },
                        {
                            url: articleData.openGraphImage || "",
                            width: 900,
                            height: 800,
                            alt: "Og Image Alt Second",
                            type: "image/jpeg",
                        },
                        { url: articleData.openGraphImage || "" },
                        { url: articleData.openGraphImage || "" },
                    ],
                    siteName: "ClinicLane",
                }}
            />

            {/*
       * Navbar
       */}
            <Navbar />
            {/*
       * Content
       */}
            <main className="my-10 p-5 flex flex-col md:px-14 xl:px-20">
                {/* Header */}
                <div className="flex flex-col">
                    {/* Title */}
                    <h1 className="font-bold text-5xl md:w-[80%]">{articleData.title}</h1>
                    {/* Tags */}
                    <div className="flex flex-wrap mt-5">
                        {articleData.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="inline-block mt-2 bg-gray-200 px-2 py-1 text-sm text-gray-700 rounded-sm mr-2"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <span className="text-2xl mt-10 md:w-[80%] text-gray-800">
                        {articleData.description}
                    </span>
                    {/* Image */}
                    <div className="mt-10">
                        <div className="relative">
                            <Image
                                src={articleData.headerImage} // Change to actual image path
                                alt="Blog Header"
                                width={1200} // Fixed width
                                height={600} // Fixed height
                                className="w-full h-[500px] object-cover rounded-lg"
                            />
                            {/* Bottom Left Text */}
                            <div className="absolute bottom-4 left-4 text-white text-sm">
                                <p className="font-light">Written by</p>
                                <p className="font-semibold">{articleData.author || "Sid"}</p>
                            </div>
                            <div className="absolute bottom-4 left-40 text-white text-sm">
                                <p className="font-light">Published on</p>
                                <p className="font-semibold">
                                    {new Date(articleData.publishDate).toDateString()}
                                </p>
                            </div>
                            {/* Social Icons & Copy Link */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="border hover:bg-white hover:text-black border-white p-2 text-sm rounded-md text-white flex items-center gap-2">
                                    <IoCopyOutline />
                                    Copy link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-32 mt-16">
                    {/* Feed */}
                    <div className="col-span-2 flex flex-col leading-8">
                        {mdxContent ? (
                            <MDXRenderer source={mdxContent} />
                        ) : (
                            <p>Loading MDX...</p>
                        )}
                    </div>
                    {/* Guide Points */}
                    <div className="flex flex-col w-full mt-10">
                        <ul className="w-full">
                            {headings.map((heading, index) => (
                                <li key={index} className="pb-3 sm:pb-4 w-full">
                                    <div className="w-full border-b py-2 border-black flex justify-between items-center">
                                        <span className="font-medium text-2xl">{heading}</span>
                                        <Link href={`#${heading}`}>
                                            <BsArrowRight size={28} />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            {/*
       * Form
       */}
            <div
                id="career"
                className="flex flex-col justify-center py-16 items-center bg-gray-100 p-5  md:px-14 xl:px-20"
            >
                <ResumeForm />
                <button
                    onClick={() => {
                        setShowAssessMent(!showAssessMent);
                    }}
                    className="w-60 px-4 py-3 bg-blue-600 my-10 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                >
                    Take the Assessment
                </button>
                {showAssessMent && (
                    <iframe
                        src={`${process.env.NEXT_PUBLIC_TEST_URL
                            }/nx/view/page/${encodeURIComponent(
                                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${articleData.slug}`
                            )}`}
                        width="100%"
                        height="120vh"
                        className="overflow-hidden h-screen"
                    />
                )}
            </div>
            {/*
       * Footer
       */}
            <Footer />
        </div>
    );
};


export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/article/all`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const articles: Articles[] = await res.json();

    const paths: { params: { slug: string }; locale: string }[] = [];

    for (const locale of locales ?? []) {
        const filteredArticles = articles.filter(
            (article) => article.slug && article.language === locale
        );

        filteredArticles.forEach((article) => {
            paths.push({
                params: { slug: article.slug },
                locale,
            });
        });
    }

    return {
        paths,
        fallback: "blocking", // ISR enabled
    };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const slug = params?.slug as string;

    if (!slug || !locale) {
        return { notFound: true };
    }

    // const language = languages.find((lang) => lang.code === locale);

    const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/article/${slug}?locale=${locale}`;
    const res = await fetch(url);

    if (!res.ok) return { notFound: true };

    const blog = await res.json();

    if (!blog) return { notFound: true };

    return {
        props: {
            articleData: blog,
            locale,
            ...(await serverSideTranslations(locale, ["common"])),
        },
        revalidate: 60, // Regenerate every 60 seconds
    };
};

export default Article;