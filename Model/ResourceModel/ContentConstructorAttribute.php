<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\ResourceModel;

class ContentConstructorAttribute
{
    protected \Magento\Framework\DB\Adapter\AdapterInterface $connection;
    protected \Magento\Framework\EntityManager\MetadataPool $metadataPool;
    protected \Magento\Framework\EntityManager\TypeResolver $typeResolver;

    public function __construct(
        \Magento\Framework\App\ResourceConnection $resourceConnection,
        \Magento\Framework\EntityManager\MetadataPool $metadataPool,
        \Magento\Framework\EntityManager\TypeResolver $typeResolver
    ) {
        $this->connection = $resourceConnection->getConnection();
        $this->metadataPool = $metadataPool;
        $this->typeResolver = $typeResolver;
    }

    public function removeStoreData(int $storeId, \Magento\Eav\Api\Data\AttributeInterface $attribute, \Magento\Framework\Model\AbstractModel $model): void
    {
        $linkField = $this->getLinkField($model);
        $linkId = $this->getLinkId($model, $linkField);

        $entityTable = (string)$attribute->getBackend()->getTable();
        $attributeId = (int)$attribute->getAttributeId();

        if (empty($storeId) || empty($attributeId) || empty($entityTable) || empty($linkId)) { //phpcs:ignore
            return;
        }

        $where = [];
        $where[] = $this->connection->quoteInto('store_id = ?', $storeId);
        $where[] = $this->connection->quoteInto('attribute_id = ?', $attributeId);
        $where[] = $this->connection->quoteInto(sprintf('%s = ?', $linkField), $linkId);

        $this->connection->delete($entityTable, implode(' AND ', $where));
    }

    protected function getLinkField(\Magento\Framework\Model\AbstractModel $model): string
    {
        try {
            $entityType = $this->typeResolver->resolve($model);
        } catch (\Exception $exception) {
            return 'entity_id';
        }

        if (!$this->metadataPool->hasConfiguration($entityType)) {
            return 'entity_id';
        }

        $metadata = $this->metadataPool->getMetadata($entityType);

        return $metadata->getLinkField();
    }

    protected function getLinkId(\Magento\Framework\Model\AbstractModel $model, string $linkField): int
    {
        $linkId = (int)$model->getData($linkField);

        if (!empty($linkId)) {
            return $linkId;
        }

        return (int)$model->getId();
    }
}
