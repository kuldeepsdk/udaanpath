import type { Metadata } from "next";
import { getBlogBySlug } from "@/app/actions/blogs.actions";


type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog not found | UdaanPath",
      description: "This blog article does not exist.",
    };
  }

  const siteUrl = "https://udaanpath.com"; // 🔁 change if needed
  const blogUrl = `${siteUrl}/blogs/${blog.slug}`;

  const description =
    blog.summary.length > 155
      ? blog.summary.slice(0, 152) + "..."
      : blog.summary;

  return {
    title: `${blog.title} | UdaanPath`,
    description,

    alternates: {
      canonical: blogUrl,
    },

    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      siteName: "UdaanPath",
      type: "article",
      images: [
        {
          url: `data:image/jpeg;base64,${blog.image_base64}`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [`data:image/jpeg;base64,${blog.image_base64}`],
    },
  };
}
