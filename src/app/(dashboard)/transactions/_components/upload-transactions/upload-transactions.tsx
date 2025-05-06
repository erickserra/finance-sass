import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse';
import { UploadResults } from './upload-transactions.type';

type Props = {
  onUpload: (results: UploadResults) => void;
};

export function UploadTransactions({ onUpload }: Props) {
  const { CSVReader } = useCSVReader();
  //TODO: Add a paywall

  return (
    <CSVReader
      onUploadAccepted={(results: UploadResults) => {
        console.log('---------------------------');
        console.log(results);
        console.log('---------------------------');
        onUpload(results);
      }}
    >
      {({ getRootProps }: any) => (
        <Button className="w-full lg:w-auto" {...getRootProps()}>
          <Upload className="size-4 mr-2" />
          Import transactions
        </Button>
      )}
    </CSVReader>
  );
}
