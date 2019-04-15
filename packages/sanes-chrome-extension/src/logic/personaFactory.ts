import { UserProfile } from '@iov/core';
import { EnhancedChainSpec } from './blockchain/chainsConfig';
import Persona from './persona';

class PersonaFactory {
  // For now we only support one persona
  // private static _personas = new Map<string, Persona>();
  private static _persona: Persona;

  public static createPersona(
    userProfile: UserProfile,
    chains: EnhancedChainSpec[]
  ): Persona {
    const persona = new Persona(userProfile, chains);
    this._persona = persona;

    return persona;
  }

  public static getPersona(): Persona {
    return this._persona;
  }
}

export default PersonaFactory;
