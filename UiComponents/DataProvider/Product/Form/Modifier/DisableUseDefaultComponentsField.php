<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\UiComponents\DataProvider\Product\Form\Modifier;

class DisableUseDefaultComponentsField extends \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\AbstractModifier
{
    protected \Magento\Framework\Stdlib\ArrayManager $arrayManager;
    protected \Magento\Framework\App\RequestInterface $request;

    public function __construct(
        \Magento\Framework\Stdlib\ArrayManager $arrayManager,
        \Magento\Framework\App\RequestInterface $request
    ) {
        $this->arrayManager = $arrayManager;
        $this->request = $request;
    }

    /**
     * @param array $meta
     * @return array
     */
    public function modifyMeta(array $meta): array
    {
        $fieldPath = $this->arrayManager->findPath('use_default_components', $meta, null, 'children');
        $label = $this->arrayManager->get($fieldPath . static::META_CONFIG_PATH . '/label', $meta);

        $meta = $this->arrayManager->merge(
            $fieldPath . static::META_CONFIG_PATH,
            $meta,
            [
                'dataScope' => 'use_default_components',
                'label' => __(''),
                'description' => $label,
                'visible' => (bool) $this->request->getParam('store', false),
                'valueMap' => [
                    'true' => '1',
                    'false' => '0',
                ],
            ]
        );

        return $meta;
    }

    /**
     * @param array $data
     * @return array
     */
    public function modifyData(array $data): array
    {
        $productId = $this->request->getParam('id');
        $data[$productId]['product']['store_id'] = $this->request->getParam('store', 0);

        return $data;
    }
}
