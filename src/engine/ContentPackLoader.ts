import type { ContentPack, RightRule, ActionTemplate, Service, Question } from './types';

/**
 * Content Pack Loader
 * Loads and manages content packs for different jurisdictions
 */
export class ContentPackLoader {
  private loadedPacks: Map<string, ContentPack> = new Map();

  /**
   * Load a content pack from JSON data
   */
  public loadContentPack(packData: ContentPack): void {
    this.validateContentPack(packData);
    this.loadedPacks.set(packData.id, packData);
  }

  /**
   * Load a content pack from a URL or file path
   */
  public async loadContentPackFromUrl(url: string): Promise<ContentPack> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load content pack: ${response.statusText}`);
      }
      const packData = await response.json() as ContentPack;
      this.loadContentPack(packData);
      return packData;
    } catch (error) {
      console.error('Error loading content pack:', error);
      throw error;
    }
  }

  /**
   * Get a loaded content pack by ID
   */
  public getContentPack(packId: string): ContentPack | undefined {
    return this.loadedPacks.get(packId);
  }

  /**
   * Get all loaded content packs
   */
  public getAllContentPacks(): ContentPack[] {
    return Array.from(this.loadedPacks.values());
  }

  /**
   * Find content packs by jurisdiction
   */
  public findByJurisdiction(jurisdiction: string): ContentPack[] {
    return this.getAllContentPacks().filter(
      pack => pack.jurisdiction === jurisdiction
    );
  }

  /**
   * Get rules from a content pack
   */
  public getRules(packId: string): RightRule[] {
    const pack = this.getContentPack(packId);
    return pack?.rules ?? [];
  }

  /**
   * Get actions from a content pack
   */
  public getActions(packId: string): ActionTemplate[] {
    const pack = this.getContentPack(packId);
    return pack?.actions ?? [];
  }

  /**
   * Get a specific action by ID from a content pack
   */
  public getAction(packId: string, actionId: string): ActionTemplate | undefined {
    const actions = this.getActions(packId);
    return actions.find(action => action.id === actionId);
  }

  /**
   * Get services from a content pack
   */
  public getServices(packId: string): Service[] {
    const pack = this.getContentPack(packId);
    return pack?.services ?? [];
  }

  /**
   * Get a specific service by ID from a content pack
   */
  public getService(packId: string, serviceId: string): Service | undefined {
    const services = this.getServices(packId);
    return services.find(service => service.id === serviceId);
  }

  /**
   * Get questions from a content pack
   */
  public getQuestions(packId: string): Question[] {
    const pack = this.getContentPack(packId);
    return pack?.questions ?? [];
  }

  /**
   * Get a specific question by ID from a content pack
   */
  public getQuestion(packId: string, questionId: string): Question | undefined {
    const questions = this.getQuestions(packId);
    return questions.find(question => question.id === questionId);
  }

  /**
   * Get the entry point question for a content pack
   */
  public getEntryPoint(packId: string): Question | undefined {
    const pack = this.getContentPack(packId);
    if (!pack?.entryPoint) return undefined;
    return this.getQuestion(packId, pack.entryPoint);
  }

  /**
   * Find services by type
   */
  public findServicesByType(packId: string, type: string): Service[] {
    const services = this.getServices(packId);
    return services.filter(service => service.type === type);
  }

  /**
   * Find services that accept pets
   */
  public findPetFriendlyServices(packId: string): Service[] {
    const services = this.getServices(packId);
    return services.filter(service => service.eligibility?.acceptsPets === true);
  }

  /**
   * Find 24/7 services
   */
  public find24_7Services(packId: string): Service[] {
    const services = this.getServices(packId);
    return services.filter(service => service.availability?.isAvailable24_7 === true);
  }

  /**
   * Validate a content pack structure
   */
  private validateContentPack(pack: ContentPack): void {
    if (!pack.id) {
      throw new Error('Content pack must have an id');
    }
    if (!pack.name) {
      throw new Error('Content pack must have a name');
    }
    if (!pack.version) {
      throw new Error('Content pack must have a version');
    }
    if (!pack.jurisdiction) {
      throw new Error('Content pack must have a jurisdiction');
    }

    // Validate version format
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(pack.version)) {
      throw new Error('Content pack version must follow semantic versioning (e.g., 1.0.0)');
    }

    // Check for duplicate IDs
    this.checkDuplicateIds(pack.questions ?? [], 'questions');
    this.checkDuplicateIds(pack.rules ?? [], 'rules');
    this.checkDuplicateIds(pack.actions ?? [], 'actions');
    this.checkDuplicateIds(pack.services ?? [], 'services');
  }

  /**
   * Check for duplicate IDs in an array
   */
  private checkDuplicateIds(items: Array<{ id: string }>, type: string): void {
    const ids = new Set<string>();
    const duplicates: string[] = [];

    items.forEach(item => {
      if (ids.has(item.id)) {
        duplicates.push(item.id);
      }
      ids.add(item.id);
    });

    if (duplicates.length > 0) {
      throw new Error(
        `Duplicate ${type} IDs found in content pack: ${duplicates.join(', ')}`
      );
    }
  }

  /**
   * Clear all loaded content packs
   */
  public clearAll(): void {
    this.loadedPacks.clear();
  }

  /**
   * Remove a specific content pack
   */
  public removeContentPack(packId: string): boolean {
    return this.loadedPacks.delete(packId);
  }
}

/**
 * Singleton instance for convenience
 */
export const contentPackLoader = new ContentPackLoader();
