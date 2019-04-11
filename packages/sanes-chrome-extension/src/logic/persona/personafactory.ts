import { Persona } from './persona';
import { singleton } from '../../utils/singleton';

// TODO: Remove this when https://github.com/iov-one/ponferrada/pull/85 is done
export const getGlobalPersona = singleton<typeof Persona.create>(
  Persona.create
);
