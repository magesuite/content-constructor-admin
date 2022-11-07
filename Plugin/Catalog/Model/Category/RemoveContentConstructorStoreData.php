<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Plugin\Catalog\Model\Category;

class RemoveContentConstructorStoreData extends \MageSuite\ContentConstructorAdmin\Plugin\AbstractRemoveContentConstructorStoreData
{
    /**
     * @param \Magento\Catalog\Api\Data\CategoryInterface $subject
     * @param \Magento\Catalog\Api\Data\CategoryInterface $brand
     * @return \Magento\Catalog\Api\Data\CategoryInterface
     */
    public function afterAfterSave(
        \Magento\Catalog\Api\Data\CategoryInterface $subject,
        \Magento\Catalog\Api\Data\CategoryInterface $category
    ) {
        if ($this->restoreToDefault((int)$category->getStoreId()) === false) {
            return $category;
        }

        $this->removeContentConstructorStoreData->execute(\Magento\Catalog\Model\Category::ENTITY, $category);

        return $category;
    }
}

