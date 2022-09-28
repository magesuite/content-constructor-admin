<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Plugin\Catalog\Model\Product;

class RemoveContentConstructorStoreData extends \MageSuite\ContentConstructorAdmin\Plugin\AbstractRemoveContentConstructorStoreData
{
    /**
     * @param \Magento\Catalog\Api\Data\ProductInterface $subject
     * @param \Magento\Catalog\Api\Data\ProductInterface $brand
     * @return \Magento\Catalog\Api\Data\ProductInterface
     */
    public function afterAfterSave(
        \Magento\Catalog\Api\Data\ProductInterface $subject,
        \Magento\Catalog\Api\Data\ProductInterface $product
    ) {
        if ($this->restoreToDefault((int)$product->getStoreId()) === false) {
            return $product;
        }

        $this->removeContentConstructorStoreData->execute(\Magento\Catalog\Model\Product::ENTITY, $product);

        return $product;
    }

    /**
     * @param int|null $storeId
     * @return bool
     */
    public function restoreToDefault(?int $storeId = null): bool
    {
        $data = $this->request->getPostValue();

        return !empty($data['product']['use_default_components']) && !empty($storeId);
    }
}
