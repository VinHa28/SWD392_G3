package com.example.swd.mapper;

import com.example.swd.dto.request.RoleRequest;
import com.example.swd.dto.response.RoleResponse;
import com.example.swd.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    @Mapping(target = "permissions", ignore = true)
    void updateRole(@MappingTarget Role role, RoleRequest request);

    RoleResponse toRoleResponse(Role role);

}
