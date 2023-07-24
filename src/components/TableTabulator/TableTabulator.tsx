import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/css/tabulator_bootstrap4.min.css';

type Props = {
  tableColumns: any;
  tableData: any;
};

export default ({ tableColumns, tableData }: Props) => {
  return (
    <div>
      <ReactTabulator
        data={tableData}
        columns={tableColumns}
        layout={'fitdata'}
      />
    </div>
  );
};
