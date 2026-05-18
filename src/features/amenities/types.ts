export interface Amenity {
  _id: string;
  isActive: boolean;
  code?: string;
  translations: {
    [langCode: string]: {
      name: string;
      description?: string;
      shortDescription?: string;
    };
  };
  icon?: {
    url: string;
    publicId: string;
  };
}

