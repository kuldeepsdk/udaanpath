import type { Metadata } from "next";
import { getBlogBySlug } from "@/app/actions/blogs.actions";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);

  if (!blog || !blog.data) {
    return {
      title: "Blog not found | UdaanPath",
      description: "This blog article does not exist.",
    };
  }

  const siteUrl = "https://udaanpath.com";
  const blogUrl = `${siteUrl}/blogs/${blog.data.slug}`;

  const description =
    blog.data.summary.length > 155
      ? blog.data.summary.slice(0, 152) + "..."
      : blog.data.summary;

  const metaImage = resolveMetaImage(blog.data.image_base64);

  return {
    title: `${blog.data.title} | UdaanPath`,
    description,

    alternates: {
      canonical: blogUrl,
    },

    openGraph: {
      title: blog.data.title,
      description,
      url: blogUrl,
      siteName: "UdaanPath",
      type: "article",
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: blog.data.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.data.title,
      description,
      images: [metaImage],
    },
  };
}



function resolveMetaImage(image_base64: string) {
  if (!image_base64) return "";

  // Case 1: Already a URL
  if (
    image_base64.startsWith("http://") ||
    image_base64.startsWith("https://")
  ) {
    return image_base64;
  }

  // Case 2: Already a data URI
  if (image_base64.startsWith("data:image")) {
    return image_base64;
  }

  // Case 3: Raw base64 string
  return `data:image/jpeg;base64,${image_base64}`;
}
