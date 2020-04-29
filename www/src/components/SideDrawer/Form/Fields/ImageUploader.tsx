import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { FieldProps } from "formik";

import { useDropzone } from "react-dropzone";
import useUploader, { FileValue } from "hooks/useFiretable/useUploader";

import {
  makeStyles,
  createStyles,
  fade,
  ButtonBase,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenIcon from "@material-ui/icons/OpenInNewOutlined";

import ErrorMessage from "../ErrorMessage";
import Confirmation from "components/Confirmation";
import { IMAGE_MIME_TYPES } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    dropzoneButton: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0, 2),
      justifyContent: "flex-start",

      margin: 0,
      width: "100%",
      height: 56,

      color: theme.palette.text.secondary,

      "& svg": { marginRight: theme.spacing(2) },
    },
    dropzoneDragActive: {
      backgroundColor: fade(
        theme.palette.primary.light,
        theme.palette.action.hoverOpacity * 2
      ),
      color: theme.palette.primary.main,
    },

    imagesContainer: {
      marginTop: theme.spacing(1),
    },

    img: {
      position: "relative",

      width: 80,
      height: 80,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,

      backgroundSize: "contain",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
    },

    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      backgroundColor: "rgba(255, 255, 255, 0.8)",
      color: theme.palette.text.secondary,
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
      borderRadius: theme.shape.borderRadius,
    },

    deleteImgHover: {
      opacity: 0,
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
      }),
      "$img:hover &": { opacity: 1 },
    },
  })
);

export interface IImageUploaderProps extends FieldProps {
  docRef?: firebase.firestore.DocumentReference;
  editable?: boolean;
}

export default function ImageUploader({
  form,
  field,
  editable,
  docRef,
}: IImageUploaderProps) {
  const disabled = editable === false;
  const classes = useStyles();

  const { uploaderState, upload, deleteUpload } = useUploader();
  const { progress } = uploaderState;

  // Store a preview image locally while uploading
  const [localImage, setLocalImage] = useState<string>("");

  const onDrop = useCallback(
    acceptedFiles => {
      const imageFile = acceptedFiles[0];

      if (docRef && imageFile) {
        upload({
          docRef,
          fieldName: field.name,
          files: [imageFile],
          previousValue: field.value ?? [],
          onComplete: newValue => {
            form.setFieldValue(field.name, newValue);
            setLocalImage("");
          },
        });
        setLocalImage(URL.createObjectURL(imageFile));
      }
    },
    [docRef, field.value]
  );

  const handleDelete = (index: number) => {
    if (Array.isArray(field.value)) {
      const newValue = [...field.value];
      const toBeDeleted = newValue.splice(index, 1);
      toBeDeleted.length && deleteUpload(toBeDeleted[0]);
      form.setFieldValue(field.name, newValue);
    } else {
      deleteUpload(field.value);
      form.setFieldValue(field.name, undefined);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: IMAGE_MIME_TYPES,
  });

  const wValue: FileValue[] =
    (field.value &&
      (Array.isArray(field.value) ? field.value : [field.value])) ||
    [];

  return (
    <>
      {!disabled && (
        <ButtonBase
          className={clsx(
            classes.dropzoneButton,
            isDragActive && classes.dropzoneDragActive
          )}
          {...getRootProps()}
        >
          <input id={`sidedrawer-field-${field.name}`} {...getInputProps()} />
          <AddIcon />
          <Typography variant="body1" color="inherit">
            {isDragActive ? "Drop your image here" : "Upload image"}
          </Typography>
        </ButtonBase>
      )}

      <Grid container spacing={1} className={classes.imagesContainer}>
        {wValue.map((image, i) => (
          <Grid item key={image.url}>
            {disabled ? (
              <Tooltip title="Click to open">
                <ButtonBase
                  className={classes.img}
                  onClick={() => window.open(image.url, "_blank")}
                  style={{
                    backgroundImage: `url(${image.url})`,
                  }}
                >
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    className={clsx(classes.overlay, classes.deleteImgHover)}
                  >
                    {disabled ? <OpenIcon /> : <DeleteIcon color="inherit" />}
                  </Grid>
                </ButtonBase>
              </Tooltip>
            ) : (
              <Tooltip title="Click to delete">
                <div>
                  <Confirmation
                    message={{
                      title: "Delete Image",
                      body: "Are you sure you want to delete this image?",
                      confirm: "Delete",
                    }}
                    stopPropagation
                  >
                    <ButtonBase
                      className={classes.img}
                      onClick={() => handleDelete(i)}
                      style={{
                        backgroundImage: `url(${image.url})`,
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        className={clsx(
                          classes.overlay,
                          classes.deleteImgHover
                        )}
                      >
                        <DeleteIcon color="inherit" />
                      </Grid>
                    </ButtonBase>
                  </Confirmation>
                </div>
              </Tooltip>
            )}
          </Grid>
        ))}

        {localImage && (
          <Grid item>
            <ButtonBase
              className={classes.img}
              style={{ backgroundImage: `url(${localImage})` }}
            >
              <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.overlay}
              >
                <CircularProgress
                  color="inherit"
                  size={48}
                  variant={progress === 0 ? "indeterminate" : "static"}
                  value={progress}
                />
              </Grid>
            </ButtonBase>
          </Grid>
        )}
      </Grid>

      <ErrorMessage name={field.name} />
    </>
  );
}
