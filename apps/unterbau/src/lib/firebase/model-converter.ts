import type {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
} from 'firebase-admin/firestore';
import * as v from 'valibot';

export const modelConverter = <
  TSchema extends v.GenericSchema<unknown, { id: string }>,
>(
  schema: TSchema,
): FirestoreDataConverter<v.InferOutput<TSchema>> => ({
  toFirestore: (
    modelObject: PartialWithFieldValue<v.InferOutput<TSchema>>,
  ): DocumentData => {
    const { id, ...doc } = modelObject;
    return doc;
  },
  fromFirestore: (snapshot) => {
    try {
      return v.parse(schema, {
        id: snapshot.id,
        ...snapshot.data(),
      });
    } catch (error) {
      throw new Error(`Invalid Firestore document "${snapshot.ref.path}"`, {
        cause: error,
      });
    }
  },
});
