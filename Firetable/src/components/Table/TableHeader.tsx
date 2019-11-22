import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ImportCSV from "components/ImportCSV";
import ExportCSV from "components/ExportCSV";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/AddCircle";
import { FireTableFilter } from "../../hooks/useFiretable";
import HiddenFields from "../HiddenFields";

const useStyles = makeStyles(Theme => {
  return createStyles({
    typography: {
      padding: 1,
    },
    tableHeader: {
      padding: 8,
      width: "100%",
      display: "flex",
      flex: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      // background: Theme.palette.primary.main,
    },
    tableActions: {
      display: "flex",
      flex: "wrap",
      alignContent: "center",
      // background: Theme.palette.primary.main,
    },
    formControl: {
      margin: 2,
      minWidth: 120,
    },
  });
});

interface Props {
  collection: string;
  rowHeight: number;
  updateConfig: Function;
  addRow: Function;
  getTableFields: Function;
  columns: any;
  filters: FireTableFilter[];
}
const TableHeader = (props: Props) => {
  const {
    collection,
    rowHeight,
    updateConfig,
    columns,
    addRow,
    filters,
    getTableFields,
  } = props;
  const classes = useStyles();
  const columnsData = columns.map((column: any) => {
    const { key, name, config, type, hidden } = column;
    return { key, name, config, type, hidden };
  });

  return (
    <div className={classes.tableHeader}>
      <div>
        <Typography variant="button">{collection}</Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="outlined-age-simple">Row Height</InputLabel>
          <Select
            value={rowHeight ? rowHeight : 35}
            onChange={(event: any, child: any) => {
              updateConfig("rowHeight", event.target.value);
            }}
            labelWidth={90}
            inputProps={{
              name: "rowHeight",
              id: "outlined-rowHeight-simple",
            }}
          >
            <MenuItem value={35} key={"rowHeight-35"}>
              Tall
            </MenuItem>
            <MenuItem value={60} key={"rowHeight-60"}>
              Grande
            </MenuItem>
            <MenuItem value={100} key={"rowHeight-100"}>
              Venti
            </MenuItem>
            <MenuItem value={150} key={"rowHeight-150"}>
              Trenta
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.tableActions}>
        <HiddenFields
          getTableFields={getTableFields}
          collection={collection}
          columns={columnsData}
        />
        <ExportCSV
          columns={columnsData}
          collection={collection}
          filters={filters}
        />

        <ImportCSV columns={columns} addRow={addRow} />
        <Button
          color="secondary"
          onClick={() => {
            addRow();
          }}
        >
          Add Row
          <AddIcon />
        </Button>
      </div>
    </div>
  );
};
export default TableHeader;
