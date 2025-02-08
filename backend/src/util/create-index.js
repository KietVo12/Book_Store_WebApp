import { elasticClient } from '../../elastic-client';

const createIndex = async (indexName) => {
  await elasticClient.indices.create({ index: indexName });
  console.log("Index created");
};
