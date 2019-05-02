import { Persona } from './persona';

export class PersonaManager {
  private static instance: Persona | undefined;

  /**
   * Creates and stores a Persona instance
   */
  public static async create(fixedMnemonic?: string): Promise<Persona> {
    const newInstance = await Persona.create(fixedMnemonic);

    const server = newInstance.startSigningServer();

    // in DOM tests, the global `chrome` does not exist
    if (typeof chrome !== 'undefined') {
      console.log('Started signing server');
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Received message', request, 'from', sender);
        server
          .handleUnchecked(request)
          .then(response => {
            console.log('Responding', response);
            sendResponse(response);
          })
          .catch(console.error);
        // return true to keep sendResponse active
        return true;
      });
      console.log('Signing server ready to handle requests');
    }

    PersonaManager.instance = newInstance;
    return newInstance;
  }

  /**
   * Gets the global Persona instance
   *
   * Throws if instance does not exist, which indicates a bug in the app life cycle.
   */
  public static get(): Persona {
    if (!PersonaManager.instance) {
      throw new Error('Persona instance does not exist');
    }
    return PersonaManager.instance;
  }

  /**
   * Destroys the global persona instance.
   *
   * Throws if instance does not exist, which indicates a bug in the app life cycle.
   */
  public static destroy(): void {
    const instance = PersonaManager.get();
    instance.destroy();
    PersonaManager.instance = undefined;
  }
}
