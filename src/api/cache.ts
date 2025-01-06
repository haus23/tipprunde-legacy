import { Router } from 'express';
import * as v from 'valibot';

export const cacheRouter = Router();

const CacheKeys = v.object({
  resources: v.array(v.picklist(['championships', 'accounts'])),
  championships: v.array(v.string()),
});

cacheRouter.post('/', (req, res) => {
  res.status(500).send('Not implemented by now.');
});
