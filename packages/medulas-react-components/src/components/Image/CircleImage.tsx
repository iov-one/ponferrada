import * as React from 'react';
import Image, { ImgProps } from '../Image';
import theme from '../../theme/utils/mui';
import Block from '../Block';

interface Props extends ImgProps {
  readonly icon: string;
  readonly dia: number | string;
  readonly borderColor?: string;
  readonly circleColor?: string;
  readonly iconClasses?: string;
}

const CircleImage = ({ borderColor, circleColor, icon, dia, iconClasses, ...props }: Props): JSX.Element => {
  return (
    <Block
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={dia}
      width={dia}
      border={borderColor ? `1px solid ${borderColor}` : undefined}
      borderRadius="50%"
      bgcolor={circleColor ? circleColor : theme.palette.background.default}
      className={iconClasses}
    >
      <Image src={icon} {...props} />
    </Block>
  );
};

export default CircleImage;
