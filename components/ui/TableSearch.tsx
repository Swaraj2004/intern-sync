'use client';

import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

type TableSearchProps = {
  table: Table<any>;
  placeholder?: string;
  column: string;
};

const TableSearch: React.FC<TableSearchProps> = ({
  table,
  placeholder,
  column,
}) => {
  return (
    <div className="flex sm:items-center sm:justify-between gap-3 flex-col sm:flex-row">
      <Input
        placeholder={placeholder || ''}
        value={(table.getColumn(column)?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn(column)?.setFilterValue(event.target.value)
        }
        className="max-w-xs"
      />
    </div>
  );
};

export default TableSearch;
