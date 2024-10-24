import {GetLatestUploadedChaptersQuery} from "@/app/__generated__/graphql";
import ChapterUpdateCard from "@/app/_components/ChapterUpdateCard";


interface Props{
 chapters: GetLatestUploadedChaptersQuery["latestChapters"]
}

export default async function LatestChaptersList({chapters}: Props) {

 return (
    <div className="flex flex-col gap-3">
     <h3 className="text-xl">
      Latest chapter uploads
     </h3>
     <div className="flex flex-col gap-1">
      {chapters.map(chapter =>
          <ChapterUpdateCard
              chapter={chapter}
              key={chapter.id}
          />
      )}
     </div>
    </div>
 );
};