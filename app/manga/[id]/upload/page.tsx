import UploadChapterForm from "@/app/manga/[id]/upload/_components/UploadChapterForm";

interface Props {
  params: {
    id: string
  }
}

export default function Page({params: {id}}: Props) {


  return (
      <UploadChapterForm mangaId={id}/>
  )
};