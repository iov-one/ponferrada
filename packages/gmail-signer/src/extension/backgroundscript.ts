import { generateErrorResponse } from "./background/errorResponseGenerator";

import { updateExtensionBadge } from "./background/updaters/extensionBadgeUpdater";

// Reset extension badge to clear one after browser start because of queue reset
updateExtensionBadge(0);
