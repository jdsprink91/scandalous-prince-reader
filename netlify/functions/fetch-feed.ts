import RssParser from "rss-parser";

export default async (req: Request) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const feedUrls = searchParams.get("feeds")?.split(",");
  if (feedUrls) {
    try {
      const parser = new RssParser();
      const allFeeds = await Promise.all(
        feedUrls.map((url) => parser.parseURL(url)),
      );
      return new Response(JSON.stringify(allFeeds));
    } catch {
      return new Response(
        JSON.stringify({ msg: "There was an error getting your feed" }),
        { status: 500 },
      );
    }
  }

  // ain't got nothin
  return new Response(JSON.stringify([]));
};
