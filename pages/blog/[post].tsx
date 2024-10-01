import React, { useEffect, useState } from "react";
import moment from "moment";
import parse from "html-react-parser";
import { getPageRes, getBlogPostRes } from "../../helper";
import { onEntryChange } from "../../contentstack-sdk";
import Skeleton from "react-loading-skeleton";
import RenderComponents from "../../components/render-components";
import ArchiveRelative from "../../components/archive-relative";
import { Page, BlogPosts, PageUrl } from "../../typescript/pages";
import Player from "next-video/player";

export default function BlogPost({
  blogPost,
  page,
  pageUrl,
}: {
  blogPost: BlogPosts;
  page: Page;
  pageUrl: PageUrl;
}) {
  const [getPost, setPost] = useState({ banner: page, post: blogPost });
  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pageUrl);
      const bannerRes = await getPageRes("/blog");
      if (!entryRes || !bannerRes) throw new Error("Status: " + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [blogPost]);

  const { post, banner } = getPost;
  return (
    <>
      {/* comment out banner
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          contentTypeUid="blog_post"
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      */}
      <div className="blog-container">
        <article className="blog-detail">
          {post && post.title ? (
            <h2 {...(post.$?.title as {})}>{post.title}</h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
          {post && post.date ? (
            <p {...(post.$?.date as {})}>
              {moment(post.date).format("ddd, MMM D YYYY")},{" "}
              <strong {...(post.author[0].$?.title as {})}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          <p></p>
          return{" "}
          <Player
            src="https://www.mydomain.com/remote-video.mp4"
            poster="https://www.mydomain.com/remote-poster.webp"
            blurDataURL="data:image/webp;base64,UklGRlA..."
          />
          <video
            width="800"
            controls
            preload="none"
            poster="https://azure-na-images.contentstack.com/v3/assets/blt12e869bff3b72ddb/blt2e841106f77e3e1f/66f508e491ce053d68780d11/video_poster.png"
          >
            <source
              src="https://azure-na-assets.contentstack.com/v3/assets/blt12e869bff3b72ddb/blt2eaabfce7ed4dbf8/66f505d33e39c92441b02249/Monkey_Learn.mp4"
              type="video/mp4"
            />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
          <p></p>
          {post && post.body ? (
            <div {...(post.$?.body as {})}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={800} />
          )}
        </article>

        {/*
        <div className="blog-column-right">
          <div className="related-post">
            {banner && banner?.page_components[2].widget ? (
              <h2 {...(banner?.page_components[2].widget.$?.title_h2 as {})}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
        */}
      </div>
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getPageRes("/blog");
    const posts = await getBlogPostRes(`/blog/${params.post}`);
    if (!page || !posts) throw new Error("404");

    return {
      props: {
        pageUrl: `/blog/${params.post}`,
        blogPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
