<?php

namespace MageSuite\ContentConstructorAdmin\Repository\Xml;

class ComponentConfigurationToXmlMapper
{
    private $componentClass = 'MageSuite\ContentConstructorFrontend\Block\Component';

    private $componentClasses = [
        'Creativestyle\ContentConstructorFrontendExtension\Block\Component',
        'MageSuite\ContentConstructorFrontend\Block\Component'
    ];

    /**
     * Maps components configuration to corresponding XML Layout format
     * @param $components
     * @param $existingXml string If not empty class will modify existing XML, if empty it will generate XML from scratch
     * @return string
     */
    public function map($components, $existingXml = '')
    {
        $existingXml = trim($existingXml);

        if (!empty($existingXml)) {
            $xmlRootNode = $this->getXmlRootNodeFromExistingXml($existingXml);

            $containerReferences = $this->getContainerReferences($xmlRootNode);

            foreach($containerReferences as $containerReference) {
                $this->removeAllComponentsBlocks($containerReference);
            }

        } else {
            $xmlRootNode = $this->createXmlRootNode();
        }

        if ($components) {
            foreach ($components as $component) {
                $component['section'] = isset($component['section']) ? $component['section'] : 'content';

                $container = $this->getContainerReference($xmlRootNode, $component['section']);

                if ($container == null) {
                    $container = $this->createContainerReference($xmlRootNode, $component['section']);
                }

                $this->addComponentToXml($component, $container);
            }
        }

        return $this->removeXmlTags($xmlRootNode->asXML());
    }

    private function createXmlRootNode()
    {
        return new \SimpleXMLElement('<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" />');
    }


    /**
     * @param $configuration
     * @param $xmlRoot \SimpleXMLElement
     * @return \SimpleXMLElement
     */
    private function addComponentToXml($configuration, $xmlRoot)
    {
        $block = $xmlRoot->addChild('block');

        $block->addAttribute('class', $this->componentClass);
        $block->addAttribute('name', $configuration['id']);

        unset($configuration['id']);

        $this->generateBlockConfiguration($configuration, $block);
    }

    /**
     * @param $configuration
     * @param $block \SimpleXMLElement
     */
    private function generateBlockConfiguration($configuration, $block)
    {
        $arguments = $block->addChild('arguments');

        foreach ($configuration as $key => $value) {
            $argument = $arguments->addChild('argument');

            if (is_array($value)) {
                $this->buildArray($value, $argument);
                $argument->addAttribute('xsi:type', 'array', 'http://www.w3.org/2001/XMLSchema-instance');
            } else {
                $argument[0] = $value;
                $argument->addAttribute('xsi:type', 'string', 'http://www.w3.org/2001/XMLSchema-instance');
            }


            $argument->addAttribute('name', $key);
        }
    }

    /**
     * @param $referenceContainer \SimpleXMLElement
     */
    private function removeAllComponentsBlocks($referenceContainer)
    {
        $childrens = $referenceContainer->children();

        $nodesToDelete = [];

        foreach ($childrens->block as $block) {
            if (in_array($block->attributes()->class, $this->componentClasses)) {
                $nodesToDelete[] = $block;
            }
        }

        foreach ($nodesToDelete as $node) {
            $dom = dom_import_simplexml($node);
            $dom->parentNode->removeChild($dom);
        }
    }

    /**
     * @param $existingXml
     * @return \SimpleXMLElement
     */
    private function getXmlRootNodeFromExistingXml($existingXml)
    {
        $existingXml = '<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' . $existingXml . '</xml>';

        $xmlRoot = simplexml_load_string($existingXml);

        return $xmlRoot;
    }

    private function createContainerReference($xmlRoot, $containerName) {
        $referenceContainer = $xmlRoot->addChild('referenceContainer');
        $referenceContainer->addAttribute('name', $containerName);

        return $referenceContainer;
    }

    /**
     * @param $xmlRootNode \SimpleXMLElement
     */
    private function getContainerReferences($xmlRootNode)
    {
        $references = [];

        $childrens = $xmlRootNode->children();

        foreach ($childrens->referenceContainer as $container) {
            $attributes = $container->attributes();

            $references[(string)$attributes->name] = $container;
        }

        return $references;
    }

    private function getContainerReference($xmlRootNode, $containerName) {
        $references = $this->getContainerReferences($xmlRootNode);

        return isset($references[$containerName]) ? $references[$containerName] : null;
    }

    private function removeXmlTags($xml)
    {
        $xml = str_replace('<?xml version="1.0"?>', '', $xml);
        $xml = str_replace('<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">', '', $xml);
        $xml = str_replace('<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>', '', $xml);
        $xml = str_replace('</xml>', '', $xml);

        return $xml;
    }

    /**
     * @param $array
     * @param $rootElement
     */
    private function buildArray($array, $rootElement)
    {
        foreach ($array as $key => $value) {
            $item = $rootElement->addChild('item');

            $item->addAttribute('name', $key);

            if (is_array($value)) {
                $this->buildArray($value, $item);
                $item->addAttribute('xsi:type', 'array', 'http://www.w3.org/2001/XMLSchema-instance');
            } else {
                $item->addAttribute('xsi:type', 'string', 'http://www.w3.org/2001/XMLSchema-instance');
                $item[0] = $value;
            }

        }
    }

}
