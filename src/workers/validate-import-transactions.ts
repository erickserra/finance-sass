import { z } from 'zod';

type WorkerMessage = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
};

const itemSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val))),
  amount: z.string().refine((val) => {
    const normalized = val.replace(',', '.');
    return !isNaN(parseFloat(normalized));
  }),
  payee: z.string().refine((val) => isNaN(parseFloat(val))),
});

self.onmessage = (e) => {
  const message: WorkerMessage = e.data;

  const { headers, body, selectedColumns } = message;

  const mappedData = {
    headers: headers.map((_header, index) => {
      return selectedColumns[`column_${index}`] || null;
    }),
    body: body
      .map((row) => {
        const transformedRow = row.map((cell, index) => {
          return selectedColumns[`column_${index}`] ? cell : null;
        });

        return transformedRow.every((item) => item === null) ? [] : transformedRow;
      })
      .filter((row) => row.length > 0),
  };

  const mappedHeaders = mappedData.headers;
  const mappedBody = mappedData.body;
  const dateHeaderIndex = mappedHeaders.findIndex((header) => header === 'date');
  const amountHeaderIndex = mappedHeaders.findIndex((header) => header === 'amount');
  const payeeHeaderIndex = mappedHeaders.findIndex((header) => header === 'payee');

  const transactionRows = mappedBody.map((row) => {
    return {
      date: row[dateHeaderIndex],
      amount: row[amountHeaderIndex],
      payee: row[payeeHeaderIndex],
    };
  });

  const validation = z.array(itemSchema).safeParse(transactionRows);

  if (!validation.success) {
    const { issues } = validation.error;

    const rowsWithErrors = issues.reduce((acc, err) => {
      const [rowIndex, columnHeader] = err.path;
      const rowIndexNumber = Number(rowIndex);

      if (!acc[`row_${rowIndexNumber}`]) {
        acc[`row_${rowIndexNumber}`] = new Array();
      }

      const headersIndex = {
        date: dateHeaderIndex,
        amount: amountHeaderIndex,
        payee: payeeHeaderIndex,
      } as Record<string, number>;

      acc[`row_${rowIndexNumber}`] = [...acc[`row_${rowIndexNumber}`], headersIndex[columnHeader] ?? null].filter(
        Boolean,
      );

      return acc;
    }, {} as Record<string, number[]>);

    self.postMessage({ success: false, transactions: [], errors: rowsWithErrors });
  } else {
    self.postMessage({ success: true, transactions: transactionRows, errors: [] });
  }
};
