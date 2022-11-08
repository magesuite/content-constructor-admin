<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures;

class HeadlineComponent
{
    protected const COMPONENT_TYPE = 'headline';
    protected const COMPONENT_NAME = 'Headline';

    protected string $componentId = 'component62c6';
    protected \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper;
    protected string $customCssClass = '';
    protected int $desktopVisibility = 1;
    protected ?object $entity;
    protected ?string $headingTag = 'h2';
    protected ?string $headline;
    protected int $mobileVisibility = 1;
    protected string $section = 'cc-top';
    protected \Magento\Framework\Serialize\SerializerInterface $serializer;
    protected ?int $storeId;
    protected ?string $subheadline;

    public function __construct(
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper,
        \Magento\Framework\Serialize\SerializerInterface $serializer
    ) {
        $this->configurationToXmlMapper = $configurationToXmlMapper;
        $this->serializer = $serializer;
    }

    /**
     * @param string $componentId
     * @return \MageSuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setComponentId(string $componentId): self
    {
        $this->componentId = $componentId;

        return $this;
    }

    /**
     * @param string $customCssClass
     * @return \MageSuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setCustomCssClass($customCssClass): self
    {
        $this->customCssClass = $customCssClass;

        return $this;
    }

    /**
     * @param int $desktopVisibility
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setDesktopVisibility(int $desktopVisibility): self
    {
        $this->desktopVisibility = $desktopVisibility;

        return $this;
    }

    /**
     * @param object $entity
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setEntity(object $entity): self
    {
        $this->entity = $entity;

        return $this;
    }

    /**
     * @param string $headingTag
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setHeadingTag(string $headingTag): self
    {
        $this->headingTag = $headingTag;

        return $this;
    }

    /**
     * @param string $headline
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setHeadline(string $headline): self
    {
        $this->headline = $headline;

        return $this;
    }

    /**
     * @param int $mobileVisibility
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setMobileVisibility(int $mobileVisibility): self
    {
        $this->mobileVisibility = $mobileVisibility;

        return $this;
    }

    /**
     * @param string $section
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setSection(string $section): self
    {
        $this->section = $section;

        return $this;
    }

    /**
     * @param int $storeId
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setStoreId(int $storeId): self
    {
        $this->storeId = $storeId;

        return $this;
    }

    /**
     * @param string $subheadline
     * @return \Magesuite\ContentConstructorAdmin\Fixtures\HeadlineComponent
     */
    public function setSubheadline(string $subheadline): self
    {
        $this->subheadline = $subheadline;

        return $this;
    }

    /**
     * @return object
     */
    public function addHeaderComponentToEntity(): object
    {
        if ($this->entity instanceof \MageSuite\BrandManagement\Api\Data\BrandsInterface) {
            $attributeValue = $this->getNotSerializedData();
            $layoutUpdateXml = $this->configurationToXmlMapper->map($attributeValue, $this->entity->getLayoutUpdateXml());
            $this->entity->setLayoutUpdateXml($layoutUpdateXml);
        } else {
            $attributeValue = $this->getSerializedData();
            $this->entity->setData(
                \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME,
                $attributeValue
            );
        }

        return $this->entity;
    }

    /**
     * @return array
     */
    protected function getData(): array
    {
        return [
            [
                'type' => self::COMPONENT_TYPE,
                'name' => self::COMPONENT_NAME,
                'id' => $this->componentId,
                'section' => $this->section,
                'data' => [
                    'customCssClass' => $this->customCssClass,
                    'title' => $this->headline,
                    'subtitle' => $this->subheadline,
                    'headingTag' => $this->headingTag,
                    'componentVisibility' => [
                        'mobile' => $this->mobileVisibility,
                        'desktop' => $this->desktopVisibility,
                    ]
                ]
            ]
        ];
    }

    /**
     * @return bool|string
     */
    protected function getSerializedData()
    {
        $data = $this->getNotSerializedData();

        return $this->serializer->serialize($data);
    }

    /**
     * @return array
     */
    protected function getNotSerializedData(): array
    {
        $data = $this->getData();

        $attributeValue = $this->entity->getData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

        if (!empty($attributeValue)) {
            $attributeData = $this->serializer->unserialize($attributeValue);
            $data = array_merge($attributeData, $data);
        }

        return $data;
    }
}
