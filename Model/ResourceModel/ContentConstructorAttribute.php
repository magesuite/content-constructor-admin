<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\ResourceModel;

class ContentConstructorAttribute
{
    protected \Magento\Framework\DB\Adapter\AdapterInterface $connection;

    public function __construct(\Magento\Framework\App\ResourceConnection $resourceConnection)
    {
        $this->connection = $resourceConnection->getConnection();
    }

    public function removeStoreData(int $storeId, int $attributeId, string $entityTable, int $entityId): void //phpcs:ignore
    {
        if (empty($storeId) || empty($attributeId) || empty($entityTable) || empty($entityId)) { //phpcs:ignore
            return;
        }

        $where = [];
        $where[] = $this->connection->quoteInto('store_id = ?', $storeId);
        $where[] = $this->connection->quoteInto('attribute_id = ?', $attributeId);
        $where[] = $this->connection->quoteInto('entity_id = ?', $entityId);

        $this->connection->delete($entityTable, implode(' AND ', $where));
    }
}
