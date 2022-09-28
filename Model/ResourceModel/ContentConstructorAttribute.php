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

    /**
     * @param int $storeId
     * @param int $attributeId
     * @param string $entityTable
     * @return int
     */
    public function removeStoreData(int $storeId, int $attributeId, string $entityTable): int
    {
        if (empty($storeId) || empty($attributeId) || empty($entityTable)) {
            return 0;
        }

        $where  = $this->connection->quoteInto('store_id = ? and ', $storeId);
        $where .= $this->connection->quoteInto('attribute_id = ?', $attributeId);

        return $this->connection->delete($entityTable, $where);
    }
}
