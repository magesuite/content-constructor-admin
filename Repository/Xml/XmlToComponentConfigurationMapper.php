<?php

namespace MageSuite\ContentConstructorAdmin\Repository\Xml;

class XmlToComponentConfigurationMapper
{
    /**
     * Maps XML Layout definition to corresponding components configuration
     * @param $xml
     * @return array
     */
    public function map($xml)
    {
        $components = [];

        $blocks = $this->getBlocksFromXml($xml);

        foreach ($blocks as $block) {
            if (!$this->isComponentBlock($block)) {
                continue;
            }

            $components[] = $this->getComponentConfiguration($block);;
        }

        return $components;
    }

    private function getBlocksFromXml($xml)
    {
        $xml = '<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' . $xml . '</xml>';

        $xml = simplexml_load_string($xml);

        if (!isset($xml->referenceContainer)) {
            return [];
        }

        $references = $this->getContainersReferences($xml);

        $blocks = [];

        foreach($references as $reference) {
            $childrens = $reference->children();

            if(!isset($childrens->block)) {
                continue;
            }

            foreach($childrens->block as $block) {
                $block->addAttribute('section', (string)$reference->attributes()->name);

                $blocks[] = $block;
            }
        }

        return $blocks;
    }

    /**
     * @param $block \SimpleXMLElement
     * @return array
     */
    private function getComponentConfiguration($block)
    {
        $configuration = [];

        $configuration += $this->getBlockAttributes($block);
        $configuration += $this->getBlockArguments($block);

        return $configuration;
    }

    /**
     * @param $block \SimpleXMLElement
     * @return array
     */
    private function getBlockAttributes($block)
    {
        return ['id' => $this->getNodeName($block), 'section' => $this->getNodeSection($block)];
    }

    /**
     * @param $block \SimpleXMLElement
     * @return array
     */
    private function getBlockArguments($block)
    {
        $configuration = [];

        foreach ($block->arguments->argument as $argument) {
            $name = $this->getNodeName($argument);

            if ($this->isArray($argument)) {
                $configuration[$name] = $this->getArrayValue($argument->item);
                continue;
            }

            $configuration[$name] = (string)$argument;
        }

        return $configuration;
    }

    /**
     * @param $block \SimpleXMLElement
     * @return mixed
     */
    private function isComponentBlock($block)
    {
        return $block->attributes()->class == 'MageSuite\ContentConstructorFrontend\Block\Component';
    }

    /**
     * @param $xml
     * @return mixed
     */
    private function getContainersReferences($xml)
    {
        $references = [];

        foreach ($xml->referenceContainer as $reference) {
            $references[] = $reference;
        }

        return $references;
    }

    private function getArrayValue($items)
    {
        $return = [];

        foreach ($items as $item) {
            $name = $this->getNodeName($item);

            $return[$name] = $this->isArray($item) ? $this->getArrayValue($item) : (string)$item;
        }

        return $return;
    }

    /**
     * @param $node \SimpleXMLElement
     * @return bool
     */
    private function isArray($node)
    {
        return $node->attributes('xsi', true)->type == 'array';
    }

    /**
     * @param $node \SimpleXMLElement
     * @return string
     */
    private function getNodeName($node)
    {
        return (string)$node->attributes()->name;
    }

    /**
     * @param $node \SimpleXMLElement
     * @return string
     */
    private function getNodeSection($node)
    {
        return (string)$node->attributes()->section;
    }
}