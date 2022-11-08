<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Plugin;

abstract class AbstractRemoveContentConstructorStoreData
{
    protected \MageSuite\ContentConstructorAdmin\Service\RemoveContentConstructorStoreData $removeContentConstructorStoreData;
    protected \Magento\Framework\App\RequestInterface $request;

    public function __construct(
        \MageSuite\ContentConstructorAdmin\Service\RemoveContentConstructorStoreData $removeContentConstructorStoreData,
        \Magento\Framework\App\RequestInterface $request
    ) {
        $this->removeContentConstructorStoreData = $removeContentConstructorStoreData;
        $this->request = $request;
    }

    /**
     * @return bool
     */
    public function restoreToDefault(?int $storeId = null): bool
    {
        $data = $this->request->getPostValue();

        if (empty($data['store_id'])) {
            $data['store_id'] = $storeId ?? 0;
        }

        return !empty($data['use_default_components']) && !empty($data['store_id']);
    }
}
