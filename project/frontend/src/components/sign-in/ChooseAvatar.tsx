'use client';

import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { SelectAvatar } from './SelectAvatar';

type ChooseAvatarProps = {
  readonly avatars: string[];
  readonly onChooseClick: (avatar: string) => void;
};

export interface FileResult {
  result: ArrayBuffer;
  type: string;
}

export const AvailableImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
export const ImageLimitSize = 10 * 1024 * 1024; // 10MB

export const validateAvatarImageFile = (file: File) => {
  if (!AvailableImageTypes.includes(file.type)) {
    return `지원하지 않는 파일입니다: 지원파일 리스트 ${AvailableImageTypes}`;
  }

  if (file.size > ImageLimitSize) {
    return `제한 사이즈 10MB를 초과하였습니다.`;
  }

  return '';
};

// is : 이 함수가 true 반환시, resultArrayBuffer의 타입을 ArrayBuffer임을 보장. 타입 가드
export const isOkOnReadAsArrayBuffer = (
  resultArrayBuffer: string | ArrayBuffer | null | undefined,
): resultArrayBuffer is ArrayBuffer =>
  !!resultArrayBuffer && resultArrayBuffer instanceof ArrayBuffer;

export const requsetUpload = (fileResult: FileResult) =>
  fetch('/api/v1/avatar/upload', {
    method: 'POST',
    body: fileResult.result,
    headers: {
      'Content-Type': fileResult.type,
    },
  });

export default function ChooseAvatar({
  avatars,
  onChooseClick,
}: ChooseAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [loadFileResult, setLoadFileResult] = useState<FileResult | null>(null);
  const { api } = useContext(ApiContext);
  const [isError, setIsError] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileInputElement = event.target;
    const targetFiles = fileInputElement.files;

    if (targetFiles === null || targetFiles.length === 0) {
      console.error(`targetFiles X`);
      return;
    }

    const selectedFile = targetFiles[0];

    const errMsg = validateAvatarImageFile(selectedFile);

    if (errMsg) {
      alert(errMsg);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const resultArrayBuffer = e.target?.result;

      if (!isOkOnReadAsArrayBuffer(resultArrayBuffer)) {
        console.error(
          `브라우저 파일 로드 결과가 어레이버퍼가 아님: ${resultArrayBuffer}`,
        );
        return;
      }

      setLoadFileResult({
        result: resultArrayBuffer,
        type: selectedFile.type,
      });
    };

    reader.onerror = (error) => {
      console.error(error);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const callApi = async function (fileResult: FileResult) {
    try {
      const response = await requsetUpload(fileResult);
      const jsonData = await response.json();
      if (response.ok) {
        const { filePath } = jsonData;
        console.log(`Uploaded image successfully: ${filePath}`);
        setUploadImage(filePath);
      } else {
        const { message, error, statusCode } = jsonData;
        console.error(`callApi's response not ok: `, response);
        alert(message || '아바타 이미지 업로드에 실패했습니다');
      }
    } catch (error) {
      console.error('Fail to callApi: ', error);
    }
  }, [selectedFile, callApi]);

  const onClickUploadAvatar = () => {
    if (uploadImage) {
      setSelectedAvatar(uploadImage);
    }
  };

  const onClickNextBtn = () => {
    if (selectedAvatar) {
      onChooseClick(selectedAvatar);
    }
  };

  const uploadAvatarBoxClassName =
    (uploadImage && selectedAvatar === uploadImage
      ? 'border-dark-purple w-lg h-lg'
      : 'border-default hover:border-dark-gray hover:bg-light-background w-lg h-lg') +
    ' border-3 inline-block overflow-x-hidden overflow-y-hidden';

  // Input 태그를 통해 이미지가 브라우저까지 업로드에 성공시 호출
  useEffect(() => {
    async function uploadToServer(fileResult: FileResult) {
      try {
        await callApi(fileResult);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadFileResult(null);
      }
    }
    if (loadFileResult) {
      uploadToServer(loadFileResult);
    }
  }, [loadFileResult]);

  // 위 useEffect에 의해 트리거 되어 서버에 업로드 성공시 호출
  useEffect(() => {
    if (uploadImage) {
      setSelectedAvatar(uploadImage);
    }
  }, [uploadImage]);

  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center px-2xl">
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>
      {render()}
    </div>
  );

  function render() {
    if (isError) {
      return <>알 수 없는 에러입니다.</>;
    } else {
      return (
        <div className="flex flex-col justify-center items-center">
          <div className="grid grid-cols-3 grid-flow-row gap-xl mb-lg">
            {avatars.map((avatar) => (
              <SelectAvatar
                key={avatar}
                imageUrl={avatarToUrl(avatar)}
                isSelected={selectedAvatar === avatar}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
            <div className={uploadAvatarBoxClassName}>
              {uploadImage && (
                <Image
                  src={avatarToUrl(uploadImage)}
                  priority={true}
                  alt="avatar"
                  width={100}
                  height={100}
                  onClick={onClickUploadAvatar}
                />
              )}
            </div>
          </div>
          <input
            type="file"
            accept={AvailableImageTypes.join(' ')}
            name="profile_img"
            className="text-md ml-[120px]"
            onChange={handleFileChange}
          />
          <div className="self-end">
            <Button onClick={onClickNextBtn} disabled={!selectedAvatar}>
              다음으로
            </Button>
          </div>
        </div>
      );
    }
  }
}
