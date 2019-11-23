"use strict";
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Popper_1 = __importDefault(require("@material-ui/core/Popper"));
var Fade_1 = __importDefault(require("@material-ui/core/Fade"));
var Paper_1 = __importDefault(require("@material-ui/core/Paper"));
var Grid_1 = __importDefault(require("@material-ui/core/Grid"));
var ClickAwayListener_1 = __importDefault(
  require("@material-ui/core/ClickAwayListener")
);
var styles_1 = require("@material-ui/core/styles");
var useStyles = styles_1.makeStyles(function(Theme) {
  return styles_1.createStyles({
    container: {
      padding: 15,
    },
    typography: {
      padding: 1,
    },
    header: {
      position: "absolute",
      left: 0,
      top: 0,
    },
    button: {},
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: Theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: Theme.spacing(2),
    },
    toggleGrouped: {
      margin: Theme.spacing(0.5),
      border: "none",
      padding: Theme.spacing(0, 1),
      "&:not(:first-child)": {
        borderRadius: Theme.shape.borderRadius,
      },
      "&:first-child": {
        borderRadius: Theme.shape.borderRadius,
      },
    },
  });
});
var ColumnEditor = function(props) {
  var anchorEl = props.anchorEl,
    column = props.column,
    handleClose = props.handleClose,
    actions = props.actions;
  var _a = react_1.useState({
      type: null,
      name: "",
      options: [],
      collectionPath: "",
      config: {},
    }),
    values = _a[0],
    setValues = _a[1];
  var _b = react_1.useState(function() {
      return [""];
    }),
    flags = _b[0],
    setFlags = _b[1];
  var classes = useStyles();
  function handleChange(event) {
    setValues(function(oldValues) {
      var _a;
      return __assign(
        {},
        oldValues,
        ((_a = {}), (_a[event.target.name] = event.target.value), _a)
      );
    });
  }
  var setValue = function(key, value) {
    setValues(function(oldValues) {
      var _a;
      return __assign({}, oldValues, ((_a = {}), (_a[key] = value), _a));
    });
  };
  react_1.useEffect(
    function() {
      if (column && !column.isNew) {
        setValues(function(oldValues) {
          return __assign({}, oldValues, {
            name: column.name,
            type: column.type,
            key: column.key,
            isNew: column.isNew,
          });
        });
        if (column.options) {
          setValue("options", column.options);
        } else {
          setValue("options", []);
        }
        if (column.collectionPath) {
          setValue("collectionPath", column.collectionPath);
        }
        ["resizable", "editable", "fixed", "hidden"].map(function(flag) {
          if (column[flag]) {
            setFlags(flags.concat([flag]));
          }
        });
      }
    },
    [column]
  );
  var clearValues = function() {
    setValues({
      type: null,
      name: "",
      options: [],
      collectionPath: "",
      config: {},
    });
  };
  var onClickAway = function(event) {
    var elementId = event.target.id;
    if (!elementId.includes("select")) {
      handleClose();
      clearValues();
    }
  };
  var handleToggle = function(event, newFlags) {
    setFlags(newFlags);
  };
  var createNewColumn = function() {
    var name = values.name,
      type = values.type,
      options = values.options,
      collectionPath = values.collectionPath,
      config = values.config;
    actions.add(name, type, {
      options: options,
      collectionPath: collectionPath,
      config: config,
    });
    handleClose();
    clearValues();
  };
  var deleteColumn = function() {
    actions.remove(props.column.idx);
    handleClose();
    clearValues();
  };
  var disableAdd = function() {
    var type = values.type,
      name = values.name,
      options = values.options,
      collectionPath = values.collectionPath,
      config = values.config;
    if (!type || name === "") return true;
    return false;
  };
  if (column) {
    return react_1.default.createElement(
      ClickAwayListener_1.default,
      { onClickAway: onClickAway },
      react_1.default.createElement(
        Popper_1.default,
        {
          className: classes.header,
          id: "id-" + column.name + "-filter",
          open: !!anchorEl,
          anchorEl: anchorEl,
          placement: "bottom-end",
          transition: true,
        },
        function(_a) {
          var TransitionProps = _a.TransitionProps;
          return react_1.default.createElement(
            Fade_1.default,
            __assign({}, TransitionProps, { timeout: 350 }),
            react_1.default.createElement(
              Paper_1.default,
              {
                className: classes.container,
                style: { minWidth: column.width ? column.width - 20 : 200 },
              },
              react_1.default.createElement(Grid_1.default, {
                container: true,
                direction: "column",
              })
            )
          );
        }
      )
    );
  }
  return react_1.default.createElement("div", null);
};
exports.default = ColumnEditor;
//# sourceMappingURL=index.js.map
