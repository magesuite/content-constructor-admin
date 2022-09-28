<?php

namespace MageSuite\ContentConstructorAdmin\Plugin;

class ProductEdit
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    protected $configurationToXmlMapper;

    /**
     * @var \Magento\Framework\App\RequestInterface
     */
    protected $request;

    public function __construct(
        \Magento\Framework\App\RequestInterface $request,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper
    ) {
        $this->configurationToXmlMapper = $configurationToXmlMapper;
        $this->request = $request;
    }

    /**
     * There is no observer before saving product so we need to inject CC XML using plugin
     * @param \Magento\Catalog\Controller\Adminhtml\Product\Builder $subject
     * @param callable $proceed
     * @param \Magento\Framework\App\RequestInterface $request
     * @return mixed
     */
    public function aroundInitializeFromData(\Magento\Catalog\Controller\Adminhtml\Product\Initialization\Helper $subject, callable $proceed, $product, array $productData)
    {
        /** @var \Magento\Catalog\Model\Product $product */
        $product = $proceed($product, $productData);

        $data = $this->request->getPostValue();

        if (empty($data['use_default_components']) && !empty($data['components'])) {
            $product->setContentConstructorContent($data['components']);
        }

        return $product;
    }
}
