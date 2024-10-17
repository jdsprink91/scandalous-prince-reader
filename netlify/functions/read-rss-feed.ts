import RssParser from "rss-parser";

export default async (req: Request) => {
  const { q } = (await req.json()) as { q: string };
  const parser = new RssParser();
  try {
    const feed = await parser.parseURL(q);
    return new Response(JSON.stringify({ ...feed }));
  } catch {
    return new Response(
      JSON.stringify({ msg: "There was an error parsing this feed" }),
      { status: 500 },
    );
  }
};
