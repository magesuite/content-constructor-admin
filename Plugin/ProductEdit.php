<?php

namespace MageSuite\ContentConstructorAdmin\Plugin;

class ProductEdit
{
    /**
     * @var \Magento\Framework\App\Cache\TypeListInterface
     */
    protected $cacheTypeList;

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
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper
    )
    {
        $this->cacheTypeList = $cacheTypeList;
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
    public function aroundInitializeFromData(
        \Magento\Catalog\Controller\Adminhtml\Product\Initialization\Helper $subject, callable $proceed, $product, array $productData
    ) {
        /** @var \Magento\Catalog\Model\Product $product */
        $product = $proceed($product, $productData);

        $data = $this->request->getPostValue();

        if(isset($data['components']) AND !empty($data['components'])) {
            $components = json_decode($data['components'], true);

            $layoutUpdateXml = $this->configurationToXmlMapper->map($components, $product->getCustomLayoutUpdate());

            $product->setCustomLayoutUpdate($layoutUpdateXml);
        }

        $this->clearLayoutCache();

        return $product;
    }

    protected function clearLayoutCache()
    {
        $this->cacheTypeList->cleanType('layout');
    }
}
