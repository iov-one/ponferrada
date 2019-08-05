import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import * as React from "react";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  noShrink: {
    flexShrink: 0,
  },
  bordered: {
    border: "1px solid #ddd",
  },
  fullwidth: {
    padding: 0,
    width: "40% !important",
    margin: "0 60% 25px !important",
  },
  cover: {
    objectFit: "cover",
    width: "100%",
    height: "100vh",
  },
});

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly cover?: boolean;
  readonly alt: string;
  readonly fullwidth?: boolean;
  readonly bordered?: boolean;
  readonly noShrink?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

const Image = ({
  fullwidth,
  alt,
  cover,
  bordered,
  noShrink,
  className,
  style,
  ...props
}: ImgProps): JSX.Element => {
  const styles = useStyles();
  const imageClassNames = classNames(styles.root, className, {
    [styles.fullwidth]: fullwidth,
    [styles.bordered]: bordered,
    [styles.cover]: cover,
    [styles.noShrink]: noShrink,
  });

  return <img alt={alt} style={style} {...props} className={imageClassNames} />;
};

export default Image;
