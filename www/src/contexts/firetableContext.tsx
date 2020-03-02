import React, { useState, useContext, useEffect, useRef } from "react";
import _groupBy from "lodash/groupBy";

import { Column, DataGridHandle } from "react-data-grid";
import { PopoverProps } from "@material-ui/core";
import firebase from "firebase/app";
import useFiretable, {
  FiretableActions,
  FiretableState,
} from "hooks/useFiretable";
import useSettings from "hooks/useSettings";
import { useAppContext } from "./appContext";
type SelectedColumnHeader = {
  column: Column<any> & { [key: string]: any };
  anchorEl: PopoverProps["anchorEl"];
};

export type Table = {
  collection: string;
  name: string;
  roles: string[];
  description: string;
  regional: boolean;
  section: string;
};

interface FiretableContextProps {
  tables: Table[];
  sections: { [sectionName: string]: Table[] };
  tableState: FiretableState;
  tableActions: FiretableActions;
  updateCell: (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => void;
  createTable: Function;
  selectedCell: { row: number; column: string };
  setSelectedCell: Function;
  userClaims: any;

  sideDrawerOpen: boolean;
  setSideDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedColumnHeader: SelectedColumnHeader | null;
  setSelectedColumnHeader: React.Dispatch<
    React.SetStateAction<SelectedColumnHeader | null>
  >;

  // A ref to the data grid. Contains data grid functions
  dataGridRef: React.RefObject<DataGridHandle>;
}

const firetableContext = React.createContext<Partial<FiretableContextProps>>(
  {}
);
export default firetableContext;

export const useFiretableContext = () => useContext(firetableContext);

export const FiretableContextProvider: React.FC = ({ children }) => {
  const { tableState, tableActions } = useFiretable();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  }>();
  const [sections, setSections] = useState<FiretableContextProps["sections"]>();
  const [settings, createTable] = useSettings();
  const [userRoles, setUserRoles] = useState<null | string[]>();
  const [userClaims, setUserClaims] = useState<any>();
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false);
  const [
    selectedColumnHeader,
    setSelectedColumnHeader,
  ] = useState<SelectedColumnHeader | null>(null);

  const { currentUser } = useAppContext();

  useEffect(() => {
    if (currentUser && !userClaims) {
      currentUser.getIdTokenResult(true).then(results => {
        setUserRoles(results.claims.roles || []);
        setUserClaims(results.claims);
        // setUserRegions(results.claims.regions || []);
      });
    }
  }, [currentUser]);

  const updateCell = (
    ref: firebase.firestore.DocumentReference,
    fieldName: string,
    value: any
  ) => {
    if (value === null || value === undefined) return;
    const _ft_updatedAt = new Date();
    const _ft_updatedBy = currentUser?.uid ?? "";

    ref.update({
      [fieldName]: value,
      _ft_updatedAt,
      updatedAt: _ft_updatedAt,
      _ft_updatedBy,
      updatedBy: _ft_updatedBy,
    });
  };

  // A ref to the data grid. Contains data grid functions
  const dataGridRef = useRef<DataGridHandle>(null);

  return (
    <firetableContext.Provider
      value={{
        tableState,
        tableActions,
        selectedCell,
        setSelectedCell,
        updateCell,
        createTable,
        tables: tableState.tables,
        sections,
        userClaims,
        sideDrawerOpen,
        setSideDrawerOpen,
        selectedColumnHeader,
        setSelectedColumnHeader,
        dataGridRef,
      }}
    >
      {children}
    </firetableContext.Provider>
  );
};
