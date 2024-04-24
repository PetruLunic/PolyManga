import {useDropzone} from "react-dropzone";
import {Dispatch, SetStateAction, useEffect} from "react";
import {ImageInputSection} from "@/app/manga/[id]/upload/_components/UploadChapterForm";
import {CiImageOn} from "react-icons/ci";
import {Image} from "@nextui-org/react";

interface Props{
  id: string
  setImageInputSections:  Dispatch<SetStateAction<ImageInputSection>>
}

export default function ImageInput({id, setImageInputSections}: Props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }});

  useEffect(() => {
    setImageInputSections(prevState => {
      return { ...prevState, [id]: { ...prevState[id], images: acceptedFiles } };
    });
  }, [acceptedFiles]);

 return (
  <div {...getRootProps({className: 'dropzone grow'})}>
    <input {...getInputProps()} />
    <div className="flex flex-col text-gray-400 w-full border border-gray-500 border-dashed rounded-2xl ease-in duration-100 cursor-pointer p-3 hover:bg-gray-900/10">
      {acceptedFiles.length
        ? <ul className="flex flex-wrap gap-2">
            {acceptedFiles.map((file, index) => (
                <div key={index} className="my-2 overflow-hidden">
                  <Image
                      src={URL.createObjectURL(file)}
                      style={{objectFit: "cover", width: "100px", height: "150px"}}
                      alt={`Image ${file.name}`}
                  />
                </div>
            ))}
          </ul>
          : <div className="flex flex-col items-center justify-center py-10 text-center">
              <CiImageOn className="text-3xl"/>
              <p>Drag your files here or click in this area.</p>
              <p>(Only *.jpeg, *.jpg and *.png images will be accepted)</p>
          </div>}
    </div>
  </div>
 );
};