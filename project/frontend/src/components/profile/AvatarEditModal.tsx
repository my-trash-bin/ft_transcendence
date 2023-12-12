import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { Button } from '../common/Button';
import {
  AvailableImageTypes,
  FileResult,
  isOkOnReadAsArrayBuffer,
  requsetUpload,
  validateAvatarImageFile,
} from '../sign-in/ChooseAvatar';
import { SelectAvatar } from '../sign-in/SelectAvatar';

const avatars: string[] = [
  '/avatar/avatar-blue.svg',
  '/avatar/avatar-black.svg',
  '/avatar/avatar-big.svg',
  '/avatar/avatar-small.svg',
];

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<unknown>;
  defaultData: any;
}

export const AvatarEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  fetchData,
}) => {
  const { api } = useContext(ApiContext);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [loadFileResult, setLoadFileResult] = useState<FileResult | null>(null);
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
  };
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

  const updateProfile = useCallback(async () => {
    if (!selectedAvatar) {
      return;
    }
    try {
      await api.usersControllerUpdate({
        profileImageUrl: selectedAvatar,
      });
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }, [api, onClose, fetchData, selectedAvatar]);

  const onClickUploadAvatar = () => {
    if (uploadImage) {
      setSelectedAvatar(uploadImage);
    }
  };

  const uploadAvatarBoxClassName =
    (uploadImage && selectedAvatar === uploadImage
      ? 'border-dark-purple'
      : 'border-default hover:border-dark-gray hover:bg-light-background') +
    ' w-lg h-lg border-3 inline-block overflow-x-hidden overflow-y-hidden';

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="300px"
      height="550px"
    >
      <div className="w-[100%] h-[100%] relative">
        <div className="p-xl h-[100%] flex flex-col gap-lg justift-center items-center">
          <p className="text-h2 font-taebaek text-dark-purple">아바타 수정</p>
          <div className="grid grid-cols-2 grid-flow-row gap-lg">
            {avatars.map((avatar) => (
              <SelectAvatar
                key={avatar}
                imageUrl={avatar}
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
            <input
              type="file"
              accept={AvailableImageTypes.join(' ')}
              name="profile_img"
              className="text-md"
              onChange={handleFileChange}
            />
          </div>
          <Button disabled={!selectedAvatar} onClick={updateProfile}>
            수정하기
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};
