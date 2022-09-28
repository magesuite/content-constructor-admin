<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Plugin\BrandManagement\Model\Brands;

class RemoveContentConstructorStoreData extends \MageSuite\ContentConstructorAdmin\Plugin\AbstractRemoveContentConstructorStoreData
{
    /**
     * @param \MageSuite\BrandManagement\Api\Data\BrandsInterface $subject
     * @param \MageSuite\BrandManagement\Api\Data\BrandsInterface $brand
     * @return \MageSuite\BrandManagement\Api\Data\BrandsInterface
     */
    public function afterAfterSave(
        \MageSuite\BrandManagement\Api\Data\BrandsInterface $subject,
        \MageSuite\BrandManagement\Api\Data\BrandsInterface $brand
    ) {
        if ($this->restoreToDefault() === false) {
            return $brand;
        }

        $this->removeContentConstructorStoreData->execute(\MageSuite\BrandManagement\Model\Brands::ENTITY, $brand);

        return $brand;
    }
}
