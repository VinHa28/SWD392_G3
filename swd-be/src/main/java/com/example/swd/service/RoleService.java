package com.example.swd.service;

import com.example.swd.dto.request.RoleRequest;
import com.example.swd.dto.response.RoleResponse;
import com.example.swd.entity.Role;
import com.example.swd.exception.AppException;
import com.example.swd.exception.ErrorCode;
import com.example.swd.mapper.RoleMapper;
import com.example.swd.repository.PermissionRepository;
import com.example.swd.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;


    public RoleResponse create(RoleRequest request) {
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        return roleRepository
                .findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public RoleResponse update(String roleId, RoleRequest request) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        roleMapper.updateRole(role, request);
        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public void delete(String roleId) {
        roleRepository.deleteById(roleId);
    }
}
